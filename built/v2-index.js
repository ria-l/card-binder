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
//# sourceMappingURL=v2-index.js.map