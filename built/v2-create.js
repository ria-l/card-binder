import * as binder from './v2-binder.js';
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
export async function createCardImgForPulls(card, isOwned, borderColors, title) {
    // TODO: check if uploaded to GH already
    const imgBlob = await tcg.fetchBlob(card.imgUrl);
    const img64 = await utils.convertBlobToBase64(imgBlob);
    if (!img64) {
        throw new Error(`blob not converted: ${card.imgUrl}`);
    }
    const imgEl = new Image();
    imgEl.src = img64;
    imgEl.title = title;
    if (isOwned) {
        imgEl.classList.add('owned');
    }
    imgEl.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
    return imgEl;
}
export function generateImgMetadata(card) {
    const isOwned = utils.isOwnedCard(card);
    let title = `${card.name} : ${card.rarity}${!isOwned ? ' ✨NEW✨' : ''}`;
    const borderColors = ui.generateBorderColors(card.subtype, card.energy, card.supertype);
    return { isOwned, title, borderColors };
}
export async function createCardImgForBinder(card, borderColors, title) {
    // TODO: check if uploaded to GH already
    const imgBlob = await tcg.fetchBlob(card.imgUrl);
    const img64 = await utils.convertBlobToBase64(imgBlob);
    if (!img64) {
        throw new Error(`blob not converted: ${card.imgUrl}`);
    }
    const width = 150;
    const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment
    const img = new Image(width, height);
    img.src = img64;
    img.title = title;
    img.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
    img.style.setProperty('border-radius', `${width / 20}px`);
    img.classList.add('card');
    // add borders if toggle is checked
    if (document.getElementById('toggle-borders').checked) {
        img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
        img.style.setProperty('border', `${width / 15}px solid transparent`);
    }
    img.onclick = function () {
        ui.zoomCardInBinder(img);
    };
    return img;
}
export async function createPlaceholderForBinder(borderColors, title, fillColors, card) {
    const width = 150;
    const ph = document.createElement('span');
    ph.classList.add('placeholder');
    ph.title = title;
    ph.style.width = `${width}px`;
    ph.style.height = `${width * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
    ph.style.background = `linear-gradient(to bottom right, ${fillColors}) padding-box, linear-gradient(to bottom right, ${borderColors}) border-box`;
    ph.style.setProperty('border-radius', `${width / 20}px`);
    ph.style.setProperty('border', `${width / 15}px solid transparent`);
    ph.innerHTML = `${card.zRaw.number}/${card.zRaw.set.printedTotal} (${card.zRaw.set.total})
  <br>${card.name}
  <br>${card.rarity}`;
    return ph;
}
export async function createCardsForActiveSetInBinder() {
    const cardData = await get.getCardsForActiveSet();
    const tags = [];
    sort.sortBySetNum(cardData);
    for (const card of cardData) {
        const { isOwned, title, borderColors } = create.generateImgMetadata(card);
        if (isOwned) {
            tags.push(await create.createCardImgForBinder(card, borderColors, title));
        }
        else {
            const fillColors = binder.generateFillColors(card);
            tags.push(await create.createPlaceholderForBinder(borderColors, title, fillColors, card));
        }
    }
    return tags;
}
//# sourceMappingURL=v2-create.js.map