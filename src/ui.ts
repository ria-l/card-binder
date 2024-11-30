import * as constants from './constants.js';
import * as page from './page.js';

/**
 * sets background image randomly
 */
export function setBg() {
  const bgSpan = document.getElementById('bgSpan');
  const x = Math.floor(Math.random() * constants.BG_FILES.length);
  bgSpan.style.backgroundImage = `url('img/0_bg/${constants.BG_FILES[x]}')`;
}

/**
 * wrapper to set initial grid and size values
 */
export function initializeGridAndSize() {
  const cardSize = initializeSizeValue();
  generateSizeDropdown(cardSize);
  let { gridCol, gridRow } = initializeGridValues();
  generateGridDropdown(gridCol, gridRow);
}

/**
 * gets stored grid values or sets defaults
 * @returns
 */
function initializeGridValues(): { gridCol: number; gridRow: number } {
  let gridCol = parseInt(localStorage.getItem('col'));
  let gridRow = parseInt(localStorage.getItem('row'));
  // sets defaults if not in storage
  if (isNaN(gridCol)) {
    gridCol = 0;
  }
  if (isNaN(gridRow)) {
    gridRow = 0;
  }
  localStorage.setItem('row', gridRow.toString());
  localStorage.setItem('col', gridCol.toString());
  return { gridCol, gridRow };
}

/**
 * creates and displays grid dropdown elements
 * @param gridCol
 * @param gridRow
 */
function generateGridDropdown(gridCol: number, gridRow: number) {
  const colDropdown = document.getElementById(
    'colDropdown'
  ) as HTMLSelectElement;
  const rowDropdown = document.getElementById(
    'rowDropdown'
  ) as HTMLSelectElement;
  if (rowDropdown.options.length == 0) {
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      colDropdown.appendChild(option);
    }
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      rowDropdown.appendChild(option);
    }
  }
  // sets new values
  colDropdown.selectedIndex = gridCol;
  rowDropdown.selectedIndex = gridRow;
}

/**
 * saves new grid and refills page
 */
export function updateGrid() {
  localStorage.setItem(
    'row',
    (document.getElementById('rowDropdown') as HTMLSelectElement).selectedIndex
  );
  localStorage.setItem(
    'col',
    (document.getElementById('colDropdown') as HTMLSelectElement).selectedIndex
  );
  page.fillPage();
}

/**
 * gets stored card size value or sets default
 * @returns
 */
function initializeSizeValue(): number {
  let cardSize = parseInt(localStorage.getItem('cardSize'));
  // sets default if not in storage
  if (isNaN(cardSize)) {
    cardSize = 150;
  }
  // set the dropdown value to the specified size.
  localStorage.setItem('cardSize', cardSize.toString());
  return cardSize;
}

/**
 * creates and displays card size dropdown
 * @param cardSize
 */
export function generateSizeDropdown(cardSize: number) {
  const sizeDropdown = document.getElementById(
    'sizeDropdown'
  ) as HTMLSelectElement;
  if (sizeDropdown.options.length == 0) {
    const sizeDropdown = document.getElementById('sizeDropdown');
    for (let i = 1; i < 11; i++) {
      const option = document.createElement('option');
      option.value = (i * 50).toString();
      option.textContent = (i * 50).toString();
      sizeDropdown.appendChild(option);
    }
    for (let i = 1; i < 20; i++) {
      const option = document.createElement('option');
      option.value = (i * 10).toString();
      option.textContent = (i * 10).toString();
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
 * saves new size and resizes cards and placeholders
 */
export function resizeCards() {
  const cardSize = parseInt(
    (document.getElementById('sizeDropdown') as HTMLSelectElement).value
  );
  localStorage.setItem('cardSize', cardSize.toString());
  for (const card of document.getElementsByClassName(
    'card'
  ) as HTMLCollectionOf<HTMLElement>) {
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize * 1.4}px`;
    card.style.borderRadius = `${cardSize / 20}px`;
  }

  for (const ph of document.getElementsByClassName(
    'placeholder'
  ) as HTMLCollectionOf<HTMLElement>) {
    ph.style.width = `${cardSize}px`;
    ph.style.height = `${cardSize * 1.4}px`;
    ph.style.borderRadius = `${cardSize / 20}px`;
    ph.style.border = `${cardSize / 15}px solid transparent`;
  }
}

/**
 * creates and displays binder dropdown
 */
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
/**
 * creates and displays set dropdown
 */
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
/**
 * creates and displays progress bar for current binder/set
 */
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

/**
 * counts number of owned cards in the current binder/set
 * @returns
 */
function countPulled(): number {
  const data = page.getDataToDisplay();
  const header = JSON.parse(localStorage.getItem('header') ?? '[]');
  const filtered = data.filter((row) => row[header.indexOf('caught')] == 'x');
  return filtered.length;
}

/**
 * updates storage to newly selected binder, fills page if needed, and creates progress bar
 * TODO: refactor
 * TODO: make this boolean
 * @param fillpage whether the function is being called to fill the page or not
 */
export function selectNewBinder(fillpage: string) {
  localStorage.setItem('container', 'binder');
  const binderDropdown = document.getElementById(
    'binderDropdown'
  ) as HTMLSelectElement;
  const bindername = binderDropdown.options[binderDropdown.selectedIndex].text;
  localStorage.setItem('bindername', bindername);
  highlightBinder();
  if (fillpage) {
    page.fillPage();
  }
  createProgressBar();
}

/**
 * updates storage to newly selected binder, fills page if needed, and creates progress bar
 * TODO: refactor
 * TODO: make this boolean
 * @param fillpage whether the function is being called to fill the page or not
 */
export function selectNewSet(fillpage: string) {
  localStorage.setItem('container', 'set');
  const setDropdown = document.getElementById(
    'setDropdown'
  ) as HTMLSelectElement;
  const setname = setDropdown.options[setDropdown.selectedIndex].text;
  localStorage.setItem('setname', setname);
  highlightSet();
  if (fillpage) {
    page.fillPage();
  }
  createProgressBar();
}

/**
 * highlights or unhighlights binder dropdown based on what was selected
 * TODO: refactor
 */
export function highlightBinder() {
  const binderDrop = document.getElementById('binderDropdown');
  binderDrop.classList.add('highlight');
  const setDrop = document.getElementById('setDropdown');
  setDrop.classList.remove('highlight');
}

/**
 * highlights or unhighlights set dropdown based on what was selected
 * TODO: refactor
 */
export function highlightSet() {
  const setDrop = document.getElementById('setDropdown');
  setDrop.classList.add('highlight');
  const binderDrop = document.getElementById('binderDropdown');
  binderDrop.classList.remove('highlight');
}

/**
 * adds event listener that shows or hides navbar dropdowns based on what was clicked
 * TODO: this is a mess
 * @param btnId the clicked button
 * @param dropdownId the dropdown to show
 */
export function addShowHideToggle(btnId: string, dropdownId: string) {
  document.getElementById(btnId).addEventListener('click', function () {
    const arr = document.getElementsByClassName('dropdown-container');
    for (let item of arr) {
      if (item.classList.contains('show') && item.id != dropdownId) {
        item.classList.toggle('show');
      }
    }
    document.getElementById(dropdownId).classList.toggle('show');
  });
}

/**
 * adds or removes borders in binder view based on checkbox
 */
export function toggleBorders() {
  if ((document.getElementById('toggle-borders') as HTMLInputElement).checked) {
    for (const card of document.getElementsByClassName(
      'card'
    ) as HTMLCollectionOf<HTMLElement>) {
      const en = card.getAttribute('energy-type');
      const ca = card.getAttribute('card-type');
      const borderColors = page.generateBorderColors(ca, en);
      card.style.setProperty(
        'background',
        `linear-gradient(to bottom right, ${borderColors}) border-box`
      );
      const cardSize = parseInt(
        (document.getElementById('sizeDropdown') as HTMLSelectElement).value
      );
      card.style.setProperty('border', `${cardSize / 20}px solid transparent`);
    }
  } else {
    for (const card of document.getElementsByClassName(
      'card'
    ) as HTMLCollectionOf<HTMLElement>) {
      card.style.removeProperty('background');
      card.style.removeProperty('border');
    }
  }
}
