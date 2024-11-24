import * as constants from './constants.js';
import * as page from './page.js';
import * as ui from './ui.js';
import * as store from './store.js';
import * as app from './app.js';

window.onload = () => {
  ui.setSizeAndGrid();
  if (localStorage.getItem('page_status') == 'SUCCESS') {
    constants.initialize();
    loadFromStorage();
  } else {
    fetchAndFillPage();
  }
};

async function fetchAndFillPage() {
  const data = await app.fetchData();
  store.storeData(data.data);
  page.fillPage();
  ui.populateBinderDropdown();
  ui.populateSetDropdown();
  ui.createProgressBar();
  setEventListeners();
  localStorage.setItem('page_status', 'SUCCESS');
}

function loadFromStorage() {
  console.log('loading from storage');
  page.fillPage();
  ui.populateBinderDropdown();
  ui.populateSetDropdown();
  ui.createProgressBar();
  setEventListeners();
}

function setEventListeners() {
  const binderDropdown = document.getElementById('binderDropdown');
  binderDropdown.addEventListener('change', function () {
    ui.selectNewBinder('fillpage');
  });
  const setDropdown = document.getElementById('setDropdown');
  setDropdown.addEventListener('change', function () {
    ui.selectNewSet('fillpage');
  });
  const colDropdown = document.getElementById('colDropdown');
  colDropdown.addEventListener('change', function () {
    ui.setAndStoreGrid();
    page.fillPage();
  });
  const rowDropdown = document.getElementById('rowDropdown');
  rowDropdown.addEventListener('change', function () {
    ui.setAndStoreGrid();
    page.fillPage();
  });
  const sizeDropdown = document.getElementById('sizeDropdown');
  sizeDropdown.addEventListener('change', function () {
    ui.setAndStoreCardSize();
  });
  const syncButton = document.getElementById('syncButton');
  syncButton.addEventListener('click', function () {
    fetchAndFillPage();
  });
}
