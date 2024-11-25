import * as constants from './constants.js';
import * as page from './page.js';
import * as store from './store.js';

export function setBg() {
  const bgSpan = document.getElementById('bgSpan');
  const x = Math.floor(Math.random() * constants.BG_FILES.length);
  bgSpan.style.backgroundImage = `url('img/0_bg/${constants.BG_FILES[x]}')`;
}

export function initializeGridAndSize() {
  const cardSize = initializeSizeValue();
  generateSizeDropdown(cardSize);
  let { gridCol, gridRow } = initializeGridValues();
  generateGridDropdown(gridCol, gridRow);
}

function initializeGridValues() {
  let gridCol = parseInt(localStorage.getItem('col'));
  let gridRow = parseInt(localStorage.getItem('row'));
  // sets defaults if not in storage
  if (isNaN(gridCol)) {
    gridCol = 0;
  }
  if (isNaN(gridRow)) {
    gridRow = 0;
  }
  localStorage.setItem('row', gridRow);
  localStorage.setItem('col', gridCol);
  return { gridCol, gridRow };
}

function generateGridDropdown(gridCol, gridRow) {
  const colDropdown = document.getElementById('colDropdown');
  const rowDropdown = document.getElementById('rowDropdown');
  if (rowDropdown.options.length == 0) {
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      colDropdown.appendChild(option);
    }
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      rowDropdown.appendChild(option);
    }
  }
  // sets new values
  document.getElementById('colDropdown').selectedIndex = gridCol;
  document.getElementById('rowDropdown').selectedIndex = gridRow;
}

/**
 * saves new grid and refills page
 */
export function updateGrid() {
  localStorage.setItem(
    'row',
    document.getElementById('rowDropdown').selectedIndex
  );
  localStorage.setItem(
    'col',
    document.getElementById('colDropdown').selectedIndex
  );
  page.fillPage();
}

function initializeSizeValue() {
  let cardSize = parseInt(localStorage.getItem('cardSize'));
  // sets default if not in storage
  if (isNaN(cardSize)) {
    cardSize = 150;
  }
  // set the dropdown value to the specified size.
  localStorage.setItem('cardSize', cardSize);
  return cardSize;
}

export function generateSizeDropdown(cardSize) {
  const sizeDropdown = document.getElementById('sizeDropdown');
  if (sizeDropdown.options.length == 0) {
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
  // sets value
  for (let i = 0; i < sizeDropdown.options.length; i++) {
    if (sizeDropdown.options[i].value == cardSize.toString()) {
      sizeDropdown.options[i].selected = true;
      break;
    }
  }
}

/**
 * saves new size and resizes cards
 */
export function resizeCards() {
  const cardSize = parseInt(document.getElementById('sizeDropdown').value);
  localStorage.setItem('cardSize', cardSize);
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.width = `${cardSize}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.height = `${cardSize * 1.4}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.borderRadius = `${cardSize / 20}px`));

  // HTMLCollection can't use foreach
  const ph = document.getElementsByClassName('placeholder');
  for (let i = 0, len = ph.length; i < len; i++) {
    ph[i].style.width = `${cardSize}px`;
    ph[i].style.height = `${cardSize * 1.4}px`;
    ph[i].style.borderRadius = `${cardSize / 20}px`;
    ph[i].style.border = `${cardSize / 15}px solid transparent`;
  }
}

export function generateBinderDropdown() {
  const binderDropdown = document.getElementById('binderDropdown');
  const bindernames = JSON.parse(localStorage.getItem('bindernames'));
  const defaultbinder = localStorage.getItem('bindername');
  binderDropdown.innerHTML = '';
  for (let binder of bindernames) {
    const option = document.createElement('option');
    option.value = binder;
    option.textContent = binder;
    if (binder == defaultbinder) {
      option.selected = 'selected';
    }
    binderDropdown.appendChild(option);
  }
}

export function generateSetDropdown() {
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

export function createProgressBar() {
  const span = document.getElementById('progressSpan');
  const newBar = document.createElement('progress');
  const max = page.getDataToDisplay().length;
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
  const data = page.getDataToDisplay();
  const filtered = data.filter((row) => row[constants.CAUGHT_COL] == 'x');
  return filtered.length;
}

export function selectNewBinder(fillpage) {
  localStorage.setItem('container', 'binder');
  const binderDropdown = document.getElementById('binderDropdown');
  const bindername = binderDropdown.options[binderDropdown.selectedIndex].text;
  localStorage.setItem('bindername', bindername);
  if (fillpage) {
    page.fillPage();
  }
  createProgressBar();
}

export function selectNewSet(fillpage) {
  localStorage.setItem('container', 'set');
  const setDropdown = document.getElementById('setDropdown');
  const setname = setDropdown.options[setDropdown.selectedIndex].text;
  localStorage.setItem('setname', setname);
  if (fillpage) {
    page.fillPage();
  }
  createProgressBar();
}
