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
export async function openPack() {
    const cards = await get.getCardsForActiveSet();
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
async function processPulled(pulled) {
    for (const [i, card] of pulled.entries()) {
        const { isOwned, title, borderColors } = create.generateImgMetadata(card);
        const cardImg = await create.createCardImgForPulls(card, isOwned, borderColors, title);
        const imgId = `${card.id}${i.toString()}${new Date().toString()}`;
        displayLargeCard(i, imgId, cardImg);
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
function displayLargeCard(i, imgId, cardImg) {
    cardImg.id = imgId;
    // if (i === 0) {
    //   const largeCardSpan = utils.getElByIdOrThrow('large-card-span');
    //   largeCardSpan.textContent = '';
    // }
    const largeCard = cardImg.cloneNode(true);
    largeCard.classList.add('large-card');
    displayCard(largeCard, 'large-card-span');
    return;
}
function displaySmallCard(cardImg, imgId) {
    const smallCard = cardImg.cloneNode();
    smallCard.classList.add('small-card');
    smallCard.onclick = function () {
        const x = utils.getElByIdOrThrow(imgId);
        x.scrollIntoView();
        console.log('clicked', imgId);
    };
    displayCard(smallCard, 'small-card-span');
}
function displayCard(cardImg, spanId) {
    const span = utils.getElByIdOrThrow(spanId);
    span.insertBefore(cardImg, span.firstChild);
}
function addToList(title) {
    const ol = utils.getElByIdOrThrow('card-list');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(title));
    ol.insertBefore(li, ol.firstChild);
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