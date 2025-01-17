import * as constants from './v2-constants.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
await main();
async function main() {
    ui.setBg();
    if (localStorage.getItem('storage_init') !== 'SUCCESS' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        await syncData();
    }
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
    setEventListeners();
}
// this will have more later.
async function syncData() {
    await fetchAndStoreSheets();
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
        .addEventListener('click', () => syncData());
}
//# sourceMappingURL=v2-pull.js.map