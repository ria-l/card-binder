// TODO: this whole module needs to be reorganized/split into other modules

import * as app from './app.js';
import * as page from './page.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as constants from './constants.js';

window.onload = () => {
  ui.setBg();
  ui.initializeGridAndSize();
  if (
    localStorage.getItem('init_index') == 'SUCCESS' &&
    localStorage.getItem('storage_ver') == constants.STORAGE_VERSION
  ) {
    initializeIndex();
  } else {
    localStorage.clear();
    fetchAndInitializeIndex();
  }
  setEventListeners();
};

/**
 * loads all the visual elements for the index page
 */
function initializeIndex() {
  console.log('loading from storage');
  page.fillPage();
  ui.generateBinderDropdown();
  ui.generateSetDropdown();
  const collectionType = localStorage.getItem('collection_type');
  if (collectionType == 'binder') {
    ui.highlightBinder();
  } else if (collectionType == 'set') {
    ui.highlightSet();
  }
  ui.createProgressBar();
  localStorage.setItem('init_index', 'SUCCESS');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}

/**
 * wrapper method that fetches data and then loads UI
 */
async function fetchAndInitializeIndex() {
  const data = await app.fetchData();
  store.storeData(data.data);
  initializeIndex();
}

/**
 * adds event listeners to navbar elements
 */
function setEventListeners() {
  document
    .getElementById('binderDropdown')
    ?.addEventListener('change', () => ui.selectNewBinder(true));
  document
    .getElementById('setDropdown')
    ?.addEventListener('change', () => ui.selectNewSet(true));
  document
    .getElementById('colDropdown')
    ?.addEventListener('change', ui.updateGrid);
  document
    .getElementById('rowDropdown')
    ?.addEventListener('change', ui.updateGrid);
  document
    .getElementById('sizeDropdown')
    ?.addEventListener('change', ui.resizeCards);
  document
    .getElementById('sortDropdown')
    ?.addEventListener('change', sort.newSort);
  document
    .getElementById('syncButton')
    ?.addEventListener('click', fetchAndInitializeIndex);

  ui.addShowHideToggle('display-btn', 'display-dropdown');
  ui.addShowHideToggle('grid-btn', 'grid-dropdown');
  ui.addShowHideToggle('size-btn', 'size-dropdown');
  ui.addShowHideToggle('sort-btn', 'sort-dropdown');
  document
    .getElementById('toggle-borders')
    ?.addEventListener('change', ui.toggleBorders);
}
