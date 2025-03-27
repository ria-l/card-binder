import * as binder from './binder-fn.js';
import * as create from './create.js';
import * as constants from './constants.js';
import * as get from './get.js';
import * as gh from './api-github.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
import * as crCard from './create-card-tag.js';

// this is in a top-level js file.
declare function fetchAndStoreSheets(forceSync: boolean): any;

await main();

async function main() {
  console.log(' == binder main ==');
  ui.setRandomBg();
  if (
    localStorage.getItem('storage_init') !== 'SUCCESS-binder' ||
    localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION
  ) {
    console.log('main: storage not found or version mismatch. Syncing data...');
    await syncData();
  }
  await gh.fetchAndStoreGh();
  await ui.fillSetDropdown();
  await ui.createProgressBar();
  create.fillSizeDropdown();
  create.fillGridDropdown();

  setEventListeners();

  binder.fillPage();

  localStorage.setItem('storage_init', 'SUCCESS-binder');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}

async function syncData(forceSync: boolean = false) {
  console.log(' == binder syncData == ', forceSync);
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
    .getElByIdOrThrow('col-dropdown')
    .addEventListener('change', ui.updateGrid);
  utils
    .getElByIdOrThrow('row-dropdown')
    .addEventListener('change', ui.updateGrid);
  utils
    .getElByIdOrThrow('size-dropdown')
    .addEventListener('change', ui.resizeCards);
  // ui.addShowHideToggle('display-btn', 'display-dropdown');
  ui.addShowHideToggle('grid-btn', 'grid-dropdown-container');
  ui.addShowHideToggle('size-btn', 'size-dropdown-container');
  ui.addShowHideToggle('sort-btn', 'sort-dropdown-container');
  utils.getElByIdOrThrow('sort-dropdown').addEventListener('change', () => {
    binder.fillPage();
  });
  // document
  //   .getElementById('toggle-borders')
  //   ?.addEventListener('change', ui.toggleBorders); // TODO: add function
}
