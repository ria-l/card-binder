import * as constants from './constants.js';
import * as get from './get.js';
import * as gh from './api-github.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

// this is in a top-level js file.
declare function fetchAndStoreSheets(forceSync: boolean): any;

await main();

async function main() {
  console.log('== main ==');
  ui.setRandomBg();
  if (
    localStorage.getItem('storage_init') !== 'SUCCESS' ||
    localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION
  ) {
    console.log('main: storage not found or version mismatch. Syncing data...');
    await syncData();
  }
  await ui.fillSetDropdown();
  await gh.fetchAndStoreGh();
  setEventListeners();
  localStorage.setItem('storage_init', 'SUCCESS');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}

async function syncData(forceSync: boolean = false) {
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
