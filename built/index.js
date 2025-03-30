import * as constants from './constants.js';
import * as get from './get.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
await main();
async function main() {
    console.log(' == index main ==');
    ui.setRandomBg();
    if (localStorage.getItem('storage_init') !== 'SUCCESS-index' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        console.log('main: storage not found or version mismatch. Syncing data...');
        await syncData();
    }
    setEventListeners();
    localStorage.setItem('storage_init', 'SUCCESS-index');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
async function syncData(forceSync = false) {
    console.log(' == index syncData == ', forceSync);
    await fetchAndStoreSheets(forceSync);
    await tcg.fetchAndStoreSetMetadata(forceSync);
}
/**
 * sets event listeners for navbar
 */
function setEventListeners() {
    utils
        .getElByIdOrThrow('clear-storage-button')
        .addEventListener('click', () => localStorage.clear());
    utils
        .getElByIdOrThrow('sync-button')
        .addEventListener('click', () => syncData(true));
    utils
        .getElByIdOrThrow('createProgressBar')
        .addEventListener('click', () => ui.createProgressBar());
}
//# sourceMappingURL=index.js.map