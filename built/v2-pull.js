import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as gh from './v2-api-github.js';
import * as localbase from './v2-localbase.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
await main();
async function main() {
    console.log('== main ==');
    ui.setRandomBg();
    if (localStorage.getItem('storage_init') !== 'SUCCESS' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        console.log('main: storage not found or version mismatch. Syncing data...');
        await syncData();
    }
    await ui.fillSetDropdown();
    await gh.fetchAndStoreGh();
    setEventListeners();
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
async function syncData(forceSync = false) {
    console.log('== syncData ==', forceSync);
    await fetchAndStoreSheets(forceSync);
    await tcg.fetchAndStoreSetMetadata(forceSync);
}
/**
 * sets event listeners for navbar
 */
function setEventListeners() {
    utils.getElByIdOrThrow('set-dropdown').addEventListener('change', () => {
        utils.changeSet();
    });
    utils
        .getElByIdOrThrow('open-pack')
        .addEventListener('click', () => pull.openPack());
    utils
        .getElByIdOrThrow('clear-display-button')
        .addEventListener('click', ui.clearDisplay);
    utils
        .getElByIdOrThrow('debug-button')
        .addEventListener('click', () => gh.getLatestCommitSha());
}
//# sourceMappingURL=v2-pull.js.map