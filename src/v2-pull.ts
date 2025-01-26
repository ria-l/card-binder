import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

// this is in a top-level js file.
declare function fetchAndStoreSheets(forceSync: boolean): any;

await main();

async function main() {
  ui.setRandomBg();
  if (
    localStorage.getItem('storage_init') !== 'SUCCESS' ||
    localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION
  ) {
    await syncData();
  }
  await ui.fillSetDropdown();
  setEventListeners();
  localStorage.setItem('storage_init', 'SUCCESS');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}

async function syncData(forceSync: boolean = false) {
  await fetchAndStoreSheets(forceSync);
  await tcg.fetchAndStoreSetMetadata(forceSync);
}

/**
 * sets event listeners for navbar
 */
function setEventListeners() {
  utils.getElByIdOrThrow('set-dropdown').addEventListener('change', () => {
    changeSet();
  });
  utils
    .getElByIdOrThrow('open-pack')
    .addEventListener('click', () => pull.openPack());
  utils
    .getElByIdOrThrow('clear-display-button')
    .addEventListener('click', ui.clearDisplay);
  utils
    .getElByIdOrThrow('clear-storage-button')
    .addEventListener('click', () => localStorage.clear());
  utils
    .getElByIdOrThrow('sync-button')
    .addEventListener('click', () => syncData(true));
  utils
    .getElByIdOrThrow('debug-button')
    .addEventListener('click', () => get.pickAndStoreRandomSet());
}

async function changeSet() {
  const activeSet = store.saveActiveSet();

  const cardData: types.CardsDb = await get.getCardMetadata();
  const alreadyStored = cardData.find((item) => item.id === activeSet);
  if (!alreadyStored) {
    const data = await tcg.fetchCardsForSet(activeSet);
    await store.storeCardsBySetId(activeSet, data);
  }
}
