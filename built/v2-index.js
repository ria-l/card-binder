import * as binder from './v2-binder.js';
import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
await main();
async function main() {
    ui.setRandomBg();
    if (localStorage.getItem('storage_init') !== 'SUCCESS-index' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        await syncData();
    }
    await ui.fillSetDropdown();
    initializeGridAndSize();
    setEventListeners();
    binder.fillPage();
    localStorage.setItem('storage_init', 'SUCCESS-index');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
async function syncData(forceSync = false) {
    await fetchAndStoreSheets(forceSync);
    await tcg.fetchAndStoreSetMetadata(forceSync);
}
/**
 * sets event listeners for navbar
 */
function setEventListeners() {
    utils
        .getElByIdOrThrow('set-dropdown')
        .addEventListener('change', () => utils.changeSet());
    utils
        .getElByIdOrThrow('clear-storage-button')
        .addEventListener('click', () => localStorage.clear());
    utils
        .getElByIdOrThrow('sync-button')
        .addEventListener('click', () => syncData(true));
    // document
    //   .getElementById('toggle-borders')
    //   ?.addEventListener('change', ui.toggleBorders); // TODO: add function
}
/**
 * wrapper to set initial grid and size values
 */
export function initializeGridAndSize() {
    const cardSize = initializeSizeValue();
    generateSizeDropdown(cardSize);
    let { gridCol, gridRow } = initializeGridValues();
    generateGridDropdown(gridCol, gridRow);
}
/**
 * creates and displays card size dropdown
 * @param cardSize
 */
export function generateSizeDropdown(cardSize) {
    const sizeDropdown = utils.getElByIdOrThrow('size-dropdown');
    if (sizeDropdown.options.length == 0) {
        const sizeDropdown = utils.getElByIdOrThrow('size-dropdown');
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
    const option = Array.from(sizeDropdown.options).find((option) => option.value === cardSize.toString());
    if (option) {
        option.selected = true;
    }
}
/**
 * gets stored card size value or sets default
 * @returns
 */
function initializeSizeValue() {
    let cardSize = parseInt(localStorage.getItem('card_size') ?? '120');
    // set the dropdown value to the specified size.
    localStorage.setItem('card_size', cardSize.toString());
    return cardSize;
}
/**
 * gets stored grid values or sets defaults
 * @returns
 */
function initializeGridValues() {
    let gridCol = parseInt(localStorage.getItem('grid_col') ?? '0');
    let gridRow = parseInt(localStorage.getItem('grid_row') ?? '0');
    localStorage.setItem('grid_row', gridRow.toString());
    localStorage.setItem('grid_col', gridCol.toString());
    return { gridCol, gridRow };
}
/**
 * creates and displays grid dropdown elements
 * @param gridCol
 * @param gridRow
 */
function generateGridDropdown(gridCol, gridRow) {
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
    colDropdown.selectedIndex = gridCol;
    rowDropdown.selectedIndex = gridRow;
}
//# sourceMappingURL=v2-index.js.map