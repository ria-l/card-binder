import * as get from './v2-get.js';
import * as types from './v2-types.js';

export async function openPack() {
  const { setId, cards } = await get.getCardsForSet();
  console.log(setId, cards);
  const cardGroups = groupCardsByRarity(cards);
  const isGodPack = Math.floor(Math.random() * 2000) + 1 === 1;

  const pulled: types.tcgCard[] = [];

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
  // processPulled(pulled);
}

function processPulled(pulled: string[]) {
  // fetch and store metadata for the cards
  // update owned in storage and sheets
  // get image and display it and upload to github and sheets
  // update count of opened cards
}

function groupCardsByRarity(cards: types.tcgCard[]) {
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
  }, {} as Record<string, types.tcgCard[]>);
}

function getRandomCard(
  cardGroups: Record<string, types.tcgCard[]>,
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
