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

declare function fetchAndStoreSheets(forceSync: boolean): any;

await main();

async function main() {
  console.log(' == index main ==');
  ui.setRandomBg();
  if (
    localStorage.getItem('storage_init') !== 'SUCCESS-index' ||
    localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION
  ) {
    console.log('main: storage not found or version mismatch. Syncing data...');
    await syncData();
  }
  await gh.fetchAndStoreGh();
  setEventListeners();
  localStorage.setItem('storage_init', 'SUCCESS-index');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}

async function syncData(forceSync: boolean = false) {
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
    .getElByIdOrThrow('debug-button')
    .addEventListener('click', () => gh.fetchAndStoreGh());
}
