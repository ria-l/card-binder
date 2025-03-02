import * as binder from './v2-binder-fn.js';
import * as constants from './v2-constants.js';
import * as create from './v2-create.js';
import * as get from './v2-get.js';
import * as localbase from './v2-localbase.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export async function createCardImgForPulls(card, isOwned, borderColors, title, blobsObj, filePathsObj) {
    const img = new Image();
    await get.getImgSrc(card, img, blobsObj, filePathsObj);
    img.title = title;
    if (isOwned) {
        img.classList.add('owned');
    }
    img.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
    return img;
}
export async function generateImgMetadata(card) {
    const isOwned = await utils.isOwnedCard(card);
    let title = `${card.zRaw.name} : ${card.zRaw.rarity}${!isOwned ? ' ✨NEW✨' : ''}`;
    const borderColors = ui.generateBorderColors(card.subtype, card.energy, card.supertype);
    return { isOwned, title, borderColors };
}
export async function createCardImgForBinder(card, borderColors, title, blobsObj, filePathsObj) {
    const width = get.getCardSize();
    const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment
    const img = new Image(width, height);
    await get.getImgSrc(card, img, blobsObj, filePathsObj);
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
    const width = get.getCardSize();
    const ph = document.createElement('span');
    ph.classList.add('placeholder');
    ph.title = title;
    ph.style.width = `${width}px`;
    ph.style.height = `${width * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
    ph.style.background = `linear-gradient(to bottom right, ${fillColors}) padding-box, linear-gradient(to bottom right, ${borderColors}) border-box`;
    ph.style.setProperty('border-radius', `${width / 20}px`);
    ph.style.setProperty('border', `${width / 15}px solid transparent`);
    ph.style.setProperty('font-size', `${width / 10}px`);
    ph.innerHTML = `${card.zRaw.number}/${card.zRaw.set.printedTotal} (${card.zRaw.set.total})
  <br>${card.zRaw.name}
  <br>#${card.nationalDex}
  <br>${card.zRaw.rarity}`;
    return ph;
}
export async function createCardsForActiveSetInBinder() {
    console.log('== createCardsForActiveSetInBinder ==');
    const blobsObj = await localbase.db
        .collection(constants.STORAGE_KEYS.blobs)
        .get()
        .then((blobs) => {
        return blobs;
    });
    const filePathsObj = await localbase.db
        .collection(constants.STORAGE_KEYS.filePaths)
        .get()
        .then((objs) => {
        return objs;
    });
    const tags = [];
    const sorted = await sort.sortCards();
    if (!sorted) {
        throw new Error('couldn\'t sort');
    }
    for (const card of sorted) {
        const { isOwned, title, borderColors } = await create.generateImgMetadata(card);
        if (isOwned) {
            tags.push(await create.createCardImgForBinder(card, borderColors, title, blobsObj, filePathsObj));
        }
        else {
            const fillColors = binder.generateFillColors(card);
            tags.push(await create.createPlaceholderForBinder(borderColors, title, fillColors, card));
        }
    }
    return tags;
}
export function fillSizeDropdown() {
    const sizeDropdown = utils.getElByIdOrThrow('size-dropdown');
    if (sizeDropdown.options.length == 0) {
        for (let i = 1; i < 11; i++) {
            const option = document.createElement('option');
            option.value = (i * 50).toString();
            option.textContent = (i * 50).toString();
            sizeDropdown.appendChild(option);
        }
        for (let i = 1; i < 20; i++) {
            const option = document.createElement('option');
            option.value = (i * 10).toString();
            option.textContent = (i * 10).toString();
            sizeDropdown.appendChild(option);
        }
    }
    // sets value
    const cardSize = get.getCardSize();
    const option = Array.from(sizeDropdown.options).find((option) => option.value === cardSize.toString());
    if (option) {
        option.selected = true;
    }
}
export function fillGridDropdown() {
    const colDropdown = utils.getElByIdOrThrow('col-dropdown');
    const rowDropdown = utils.getElByIdOrThrow('row-dropdown');
    if (rowDropdown.options.length == 0) {
        for (let i = 0; i < 13; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            colDropdown.appendChild(option);
        }
        for (let i = 0; i < 13; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            rowDropdown.appendChild(option);
        }
    }
    // sets new values
    let gridCol = get.getGridCol();
    let gridRow = get.getGridRow();
    colDropdown.selectedIndex = gridCol;
    rowDropdown.selectedIndex = gridRow;
}
//# sourceMappingURL=v2-create.js.map