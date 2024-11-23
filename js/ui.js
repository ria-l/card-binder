import * as constants from './constants.js';
import * as store from './store.js';
import * as page from './page.js';

export function setSizeAndGrid() {
  let cardSize = parseInt(localStorage.getItem('cardSize'));
  let gridCol = parseInt(localStorage.getItem('col'));
  let gridRow = parseInt(localStorage.getItem('row'));
  if (isNaN(cardSize)) {
    cardSize = 150;
  }
  if (isNaN(gridCol)) {
    gridCol = 0;
  }
  if (isNaN(gridRow)) {
    gridRow = 0;
  }
  const rowselect = document.getElementById('rowDropdown');
  if (rowselect.options.length == 0) {
    populateGridDropdowns();
  }
  const sizeselect = document.getElementById('sizeDropdown');
  if (sizeselect.options.length == 0) {
    populateSizeDropdown();
  }
  setAndStoreCardSize(cardSize);
  setAndStoreGrid(gridCol, gridRow);
}

export function setAndStoreGrid(col, row) {
  if (col == undefined) {
    col = document.getElementById('colDropdown').selectedIndex;
  }
  if (row == undefined) {
    row = document.getElementById('rowDropdown').selectedIndex;
  }
  document.getElementById('colDropdown').selectedIndex = col;
  document.getElementById('rowDropdown').selectedIndex = row;
  localStorage.setItem('row', row);
  localStorage.setItem('col', col);
}

export function setAndStoreCardSize(size) {
  const dropdown = document.getElementById('sizeDropdown');
  if (size == undefined) {
    size = parseInt(dropdown.value);
  }
  for (var i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].value == size.toString()) {
      dropdown.options[i].selected = true;
      break;
    }
  }
  localStorage.setItem('cardSize', size);
  resizeCards();
}

function resizeCards() {
  const size = document.getElementById('sizeDropdown').value;
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.width = `${size}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.height = `${size * 1.4}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.borderRadius = `${size / 20}px`));

  // HTMLCollection can't use foreach
  const ph = document.getElementsByClassName('placeholder');
  for (var i = 0, len = ph.length; i < len; i++) {
    ph[i].style.width = `${size}px`;
    ph[i].style.height = `${size * 1.4}px`;
    ph[i].style.borderRadius = `${size / 20}px`;
    ph[i].style.border = `${size / 15}px solid transparent`;
  }
}

export function populateBinderDropdown() {
  const binderDropdown = document.getElementById('binderDropdown');
  const bindernames = JSON.parse(localStorage.getItem('bindernames'));
  const defaultbinder = localStorage.getItem('bindername');
  binderDropdown.innerHTML = '';
  for (let binder of bindernames) {
    const option = document.createElement('option');
    if (binder != 'binder') {
      option.value = binder;
      option.textContent = binder;
    }
    if (binder == defaultbinder) {
      option.selected = 'selected';
    }
    binderDropdown.appendChild(option);
  }
}

export function populateSetDropdown() {
  const setDropdown = document.getElementById('setDropdown');
  const setnames = JSON.parse(localStorage.getItem('setnames'));

  const defaultset = localStorage.getItem('setname');
  setDropdown.innerHTML = '';
  for (let set of setnames) {
    const option = document.createElement('option');
    if (set != 'set') {
      option.value = set;
      option.textContent = set;
    }
    if (set == defaultset) {
      option.selected = 'selected';
    }
    setDropdown.appendChild(option);
  }
}

export function populateGridDropdowns() {
  const colDropdown = document.getElementById('colDropdown');
  const rowDropdown = document.getElementById('rowDropdown');
  for (let i = 0; i < 13; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    colDropdown.appendChild(option);
    option.selected = 0;
  }
  for (let i = 0; i < 13; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    rowDropdown.appendChild(option);
  }
}

export function populateSizeDropdown() {
  const sizeDropdown = document.getElementById('sizeDropdown');
  for (let i = 1; i < 11; i++) {
    const option = document.createElement('option');
    option.value = i * 50;
    option.textContent = i * 50;
    sizeDropdown.appendChild(option);
  }
  for (let i = 1; i < 20; i++) {
    const option = document.createElement('option');
    option.value = i * 10;
    option.textContent = i * 10;
    sizeDropdown.appendChild(option);
  }
}

export function createProgressBar() {
  constants.initialize();
  const span = document.getElementById('progressSpan');
  const newBar = document.createElement('progress');
  const max = constants.FILL_DATA.length;
  const numPulled = countPulled();
  const ratio = document.createTextNode(`${numPulled}/${max} `);
  const percent = document.createTextNode(
    ` ${((numPulled / max) * 100).toFixed(2)}%`
  );
  const newSpan = document.createElement('span');

  newBar.max = max;
  newBar.value = numPulled;
  newSpan.id = 'progressSpan';
  newSpan.appendChild(ratio);
  newSpan.appendChild(newBar);
  newSpan.appendChild(percent);
  span.replaceWith(newSpan);
}

function countPulled() {
  const filtered = constants.FILL_DATA.filter(
    (row) => row[constants.CAUGHT_COL] == 'x'
  );
  return filtered.length;
}

export function selectNewBinder(source) {
  localStorage.setItem('binder_or_set', 'binder');
  const binderDropdown = document.getElementById('binderDropdown');
  const bindername = binderDropdown.options[binderDropdown.selectedIndex].text;
  localStorage.setItem('bindername', bindername);
  if (source == 'fillpage') {
    page.fillPage();
  }
  createProgressBar();
  store.storeFileNames('binder', bindername);
}

export function selectNewSet(source) {
  localStorage.setItem('binder_or_set', 'set');
  const setDropdown = document.getElementById('setDropdown');
  const setname = setDropdown.options[setDropdown.selectedIndex].text;
  localStorage.setItem('setname', setname);
  if (source == 'fillpage') {
    page.fillPage();
  }
  createProgressBar();
  store.storeFileNames('set', setname);
}
