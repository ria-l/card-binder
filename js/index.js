import * as app from './app.js';
import * as constants from './constants.js';
import * as page from './page.js';
import * as sorting from './sorting.js';
import * as store from './store.js';
import * as ui from './ui.js';

window.onload = () => {
  ui.setBg();
  ui.initializeGridAndSize();
  if (localStorage.getItem('page_status') == 'SUCCESS') {
    initializeIndex();
  } else {
    fetchAndInitializeIndex();
  }
  setEventListeners();
};

function initializeIndex() {
  constants.initializeConsts();
  console.log('loading from storage');
  page.fillPage();
  ui.generateBinderDropdown();
  ui.generateSetDropdown();
  ui.createProgressBar();
  localStorage.setItem('page_status', 'SUCCESS');
}

async function fetchAndInitializeIndex() {
  const data = await app.fetchData();
  store.storeData(data.data);
  initializeIndex();
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
    ui.updateGrid();
  });
  const rowDropdown = document.getElementById('rowDropdown');
  rowDropdown.addEventListener('change', function () {
    ui.updateGrid();
  });
  const sizeDropdown = document.getElementById('sizeDropdown');
  sizeDropdown.addEventListener('change', function () {
    ui.resizeCards();
  });
  const sortDropdown = document.getElementById('sortDropdown');
  sortDropdown.addEventListener('change', function () {
    sorting.newSort();
  });
  const syncButton = document.getElementById('syncButton');
  syncButton.addEventListener('click', function () {
    fetchAndInitializeIndex();
  });
}
