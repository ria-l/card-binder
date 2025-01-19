import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-fetch-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export async function openPack() {
    const { setId, cards } = await get.getCardsForSet();
    console.log(setId, cards);
    const cardGroups = groupCardsByRarity(cards);
    const isGodPack = Math.floor(Math.random() * 2000) + 1 === 1;
    const pulled = [];
    for (let i = 0; i < 5; i++) {
        let card;
        if (isGodPack) {
            card = getRandomCard(cardGroups, 'Rare', 50, 1);
        }
        else {
            if (i === 0 || i === 1 || i === 2) {
                card = getRandomCard(cardGroups, 'Common', 0, 0);
            }
            else if (i === 3) {
                card = getRandomCard(cardGroups, 'Uncommon', 95, 90);
            }
            else if (i === 4) {
                card = getRandomCard(cardGroups, 'Uncommon', 80, 60);
            }
            else {
                throw new Error(`Unexpected case: ${i}`);
            }
        }
        pulled.push(card);
    }
    console.log(pulled);
    processPulled(pulled);
}
function processPulled(pulled) {
    for (const card of pulled) {
        // push to gsheets
        // update owned storage
        // upload img to github
        // generate image tag
        const isNew = isNewCard(card);
        let title = `${card.name} : ${card.rarity}${isNew ? ' ✨NEW✨' : ''}`;
        const borderColors = ui.generateBorderColors(card.subtype, card.energy, card.supertype);
        console.log(title, card.subtype, card.energy, '|', borderColors);
        // insert small img
        // insert large img
        // display text list
    }
}
function isNewCard(card) {
    const owned = get.getGSheet('owned');
    if (card.id in owned) {
        return false;
    }
    return true;
}
function groupCardsByRarity(cards) {
    return cards.reduce((acc, card) => {
        const rarityGroup = card.rarity === 'Rare' ||
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
    }, {});
}
function getRandomCard(cardGroups, defaultGroup, starThreshold, rareThreshold) {
    let cards = cardGroups[defaultGroup] ?? cardGroups['Star']; // accounts for promo sets
    if (defaultGroup !== 'Common') {
        const x = Math.floor(Math.random() * 100) + 1;
        if (x > starThreshold) {
            cards = cardGroups['Star'];
        }
        else if (x > rareThreshold && x <= starThreshold) {
            cards = cardGroups['Rare'] ?? cardGroups['Star']; // accounts for promo sets
        }
    }
    if (!cards) {
        throw new Error(`no cards found: ${JSON.stringify(cardGroups)} ${defaultGroup}`);
    }
    const index = Math.floor(Math.random() * cards.length);
    const card = cards[index];
    if (card) {
        return card;
    }
    else {
        throw new Error(`no index ${index} in cards ${cards}`);
    }
}
//# sourceMappingURL=v2-pull-fn.js.map