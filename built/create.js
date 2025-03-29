import * as binder from './binder-fn.js';
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
import * as crCard from './create-card-tag.js';
export async function createCardImgForPulls(card, isOwned, borderColors, title, filePathsObj) {
    const img = new Image();
    await crCard.getImgSrc(card, img, filePathsObj);
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
    const filePathsObj = await localbase.db
        .collection(constants.STORAGE_KEYS.filePaths)
        .get()
        .then((objs) => {
        return objs;
    });
    const tags = [];
    const sorted = await sort.sortCards();
    if (!sorted) {
        throw new Error("couldn't sort");
    }
    for (const card of sorted) {
        const { isOwned, title, borderColors } = await create.generateImgMetadata(card);
        if (isOwned) {
            tags.push(await crCard.createCardImgForBinder(card, borderColors, title, filePathsObj));
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
//# sourceMappingURL=create.js.map