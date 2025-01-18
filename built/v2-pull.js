import * as constants from './v2-constants.js';
import * as store from './v2-store.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
import * as tcg from './v2-fetch-tcg.js';
await main();
async function main() {
    ui.setRandomBg();
    if (localStorage.getItem('storage_init') !== 'SUCCESS' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        await syncData();
    }
    await ui.fillSetDropdown();
    setEventListeners();
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
async function syncData() {
    await fetchAndStoreSheets();
    await tcg.fetchAndStoreSetMetadata();
}
/**
 * sets event listeners for navbar
 */
function setEventListeners() {
    utils
        .getElByIdOrThrow('set-dropdown')
        .addEventListener('change', () => store.saveActiveSetAndCards());
    utils
        .getElByIdOrThrow('clear-storage-button')
        .addEventListener('click', () => localStorage.clear());
    utils
        .getElByIdOrThrow('sync-button')
        .addEventListener('click', () => syncData());
}
//# sourceMappingURL=v2-pull.js.map