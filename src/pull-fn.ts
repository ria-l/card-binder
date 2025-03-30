import * as constants from './constants.js';
import * as create from './create.js';
import * as get from './get.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

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
  await processPulled(pulled);
  utils.toggleStatusModal('', 'hide');
}

function groupCardsByRarity(obj: { id: string; cards: types.Card[] }) {
  const groupedCards: {
    [key: string]: types.Card[];
  } = {};
  for (const card of obj.cards) {
    const rarityGroup =
      card.zRaw.rarity === 'Rare' ||
      card.zRaw.rarity === 'Uncommon' ||
      card.zRaw.rarity === 'Common'
        ? card.zRaw.rarity
        : 'Star';
    if (!groupedCards[rarityGroup]) {
      groupedCards[rarityGroup] = [];
    }
    groupedCards[rarityGroup].push(card);
  }
  return groupedCards;
}

async function processPulled(pulled: types.Card[]) {
  const date = new Date();
  for (const [i, card] of pulled.entries()) {
    const { isOwned, title, borderColors } = await create.generateImgMetadata(
      card
    );

    const cardImg = await create.createCardImgForPulls(
      card,
      isOwned,
      borderColors,
      title
    );
    // for scrolling in to view
    const imgId = `${card.zRaw.id}${i.toString()}${new Date().toString()}`;
    displayLargeCard(imgId, cardImg);
    displaySmallCard(cardImg, imgId);
    addToList(title);
    // update stored owned
    localbase.db.config.debug = false;
    await localbase.db
      .collection(constants.STORAGE_KEYS.owned)
      .add({ card_id: card.id, pulled_date: date });
  }
  const values = pulled.map((card) => [card.id, JSON.stringify(date)]);
  pushToSheets(constants.SHEET_NAMES.owned, values);
}

function displayLargeCard(imgId: string, cardImg: HTMLImageElement) {
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
