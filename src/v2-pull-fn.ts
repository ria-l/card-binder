import * as constants from './v2-constants.js';
import * as create from './v2-create.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

// in gapi-sheets.js
declare function pushToSheets(range: string, values: (string | Date)[][]): any;

export async function openPack() {
  const cards: { id: string; cards: types.Card[] } =
    await get.getCardsForActiveSet();
  const cardGroups = groupCardsByRarity(cards);
  const isGodPack = Math.floor(Math.random() * 2000) + 1 === 1;
  const pulled: types.Card[] = [];

  for (let i = 0; i < 5; i++) {
    let card;
    if (isGodPack) {
      card = getRandomCard(cardGroups, 'Rare', 50, 1);
    } else {
      if (i === 0 || i === 1 || i === 2) {
        card = getRandomCard(cardGroups, 'Common', 0, 0);
      } else if (i === 3) {
        card = getRandomCard(cardGroups, 'Uncommon', 95, 90);
      } else if (i === 4) {
        card = getRandomCard(cardGroups, 'Uncommon', 80, 60);
      } else {
        throw new Error(`Unexpected case: ${i}`);
      }
    }
    pulled.push(card);
  }
  console.log(pulled);
  processPulled(pulled);
}

function groupCardsByRarity(obj: { id: string; cards: types.Card[] }) {
  const groupedCards: {
    Rare: types.Card[];
    Uncommon: types.Card[];
    Common: types.Card[];
    Star: types.Card[];
  } = {
    Rare: [],
    Uncommon: [],
    Common: [],
    Star: [],
  };
  for (const card of obj.cards) {
    const rarityGroup =
      card.zRaw.rarity === 'Rare' ||
      card.zRaw.rarity === 'Uncommon' ||
      card.zRaw.rarity === 'Common'
        ? card.zRaw.rarity
        : 'Star';

    groupedCards[rarityGroup].push(card);
  }
  return groupedCards;
}

async function processPulled(pulled: types.Card[]) {
  for (const [i, card] of pulled.entries()) {
    const { isOwned, title, borderColors } = create.generateImgMetadata(card);
    const cardImg = await create.createCardImgForPulls(
      card,
      isOwned,
      borderColors,
      title
    );
    // for scrolling in to view
    const imgId = `${card.id}${i.toString()}${new Date().toString()}`;
    displayLargeCard( imgId, cardImg);
    displaySmallCard(cardImg, imgId);
    addToList(title);
  }

  const values = pulled.map((card) => [card.id, JSON.stringify(new Date())]);
  pushToSheets('TEST', values); // TODO: update to prod
  // update stored owned
  let owned = utils.getLsDataOrThrow('db-owned'); // TODO should prob be a const but whatever
  owned = [...owned, ...values];
  localStorage.setItem('db-owned', JSON.stringify(owned));

  // await gh.uploadImgs(pulled);
}

function displayLargeCard( imgId: string, cardImg: HTMLImageElement) {
  cardImg.id = imgId;
  const largeCard = cardImg.cloneNode(true) as HTMLImageElement;
  largeCard.classList.add('large-card');
  displayCard(largeCard, 'large-card-span');
  return;
}

function displaySmallCard(cardImg: HTMLImageElement, imgId: string) {
  const smallCard = cardImg.cloneNode() as HTMLImageElement;
  smallCard.classList.add('small-card');
  smallCard.onclick = function () {
    const targetCard = utils.getElByIdOrThrow(imgId);
    targetCard.scrollIntoView();
  };
  displayCard(smallCard, 'small-card-span');
}

function displayCard(cardImg: HTMLImageElement, spanId: string) {
  const span = utils.getElByIdOrThrow(spanId);
  span.insertBefore(cardImg, span.firstChild);
}

function addToList(title: string) {
  const ol = utils.getElByIdOrThrow('card-list');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(title));
  ol.insertBefore(li, ol.firstChild);
}

function getRandomCard(
  cardGroups: Record<string, types.Card[]>,
  defaultGroup: string,
  starThreshold: number,
  rareThreshold: number
) {
  let cards = cardGroups[defaultGroup] ?? cardGroups['Star']; // accounts for promo sets
  if (defaultGroup !== 'Common') {
    const x = Math.floor(Math.random() * 100) + 1;
    if (x > starThreshold) {
      cards = cardGroups['Star'];
    } else if (x > rareThreshold && x <= starThreshold) {
      cards = cardGroups['Rare'] ?? cardGroups['Star']; // accounts for promo sets
    }
  }
  if (!cards) {
    throw new Error(
      `no cards found: ${JSON.stringify(cardGroups)} ${defaultGroup}`
    );
  }
  const index = Math.floor(Math.random() * cards.length);
  const card = cards[index];
  if (card) {
    return card;
  } else {
    throw new Error(`no index ${index} in cards ${cards}`);
  }
}
