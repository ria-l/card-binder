import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

export async function openPack() {
  const cards = await get.getCardsForActiveSet();
  console.log(cards);
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

async function processPulled(pulled: types.Card[]) {
  for (const [i, card] of pulled.entries()) {
    const { isNew, title, borderColors } = generateImgMetadata(card);
    const largeCardImg = await createLargeImg(card, isNew, borderColors, title);
    if (i === 0) {
      const largeCardSpan = utils.getElByIdOrThrow('large-card-span');
      largeCardSpan.textContent = '';
    }
    displayLargeCard(largeCardImg);

    // insert small img
    // display text list
    // push to gsheets
    // update owned in LS
  }
  // await gh.uploadImgs(pulled);
}

function displayLargeCard(largeCardImg: HTMLImageElement) {
  const largeCardSpan = utils.getElByIdOrThrow('large-card-span');
  // const newSpan = document.createElement('span');
  // newSpan.id = 'large-card-span';
  largeCardSpan.insertBefore(largeCardImg, largeCardSpan.firstChild);
  // largeCardSpan.replaceWith(newSpan);
}

async function createLargeImg(
  card: types.Card,
  isNew: boolean,
  borderColors: string,
  title: string
) {
  // TODO: check if uploaded to GH already
  const imgBlob = await tcg.fetchBlob(card.imgUrl);
  const img64 = await utils.convertBlobToBase64(imgBlob);
  if (!img64) {
    throw new Error(`blob not converted: ${card.imgUrl}`);
  }
  const imgEl = new Image();
  imgEl.src = img64;
  imgEl.title = title;
  imgEl.classList.add('large-card');
  if (!isNew) {
    imgEl.classList.add('owned');
  }
  imgEl.style.setProperty(
    'background',
    `linear-gradient(to bottom right, ${borderColors}) border-box`
  );
  return imgEl;
}

function generateImgMetadata(card: types.Card) {
  const isNew = isNewCard(card);
  let title = `${card.name} : ${card.rarity}${isNew ? ' ✨NEW✨' : ''}`;
  const borderColors = ui.generateBorderColors(
    card.subtype,
    card.energy,
    card.supertype
  );
  console.log(title, card.subtype, card.energy, '|', borderColors);
  return { isNew, title, borderColors };
}

function isNewCard(card: types.Card): boolean {
  const owned = get.getGSheet('owned');
  if (card.id in owned) {
    return false;
  }
  return true;
}

function groupCardsByRarity(cards: types.Card[]) {
  return cards.reduce((acc, card) => {
    const rarityGroup =
      card.rarity === 'Rare' ||
      card.rarity === 'Uncommon' ||
      card.rarity === 'Common'
        ? card.rarity
        : 'Star';

    // If the rarity group doesn't exist in the accumulator, create it
    if (!acc[rarityGroup]) {
      acc[rarityGroup] = [];
    }
    // Push the current card into the corresponding rarity array
    acc[rarityGroup].push(card);

    return acc;
  }, {} as Record<string, types.Card[]>);
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