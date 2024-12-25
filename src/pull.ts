import * as api_clients from './api_clients.js';
import * as constants from './constants.js';
import * as page from './page.js';
import * as store from './store.js';
import * as ui from './ui.js';

window.onload = () => {
  loadPage();
};

async function loadPage() {
  if (
    localStorage.getItem('storage_init') !== 'SUCCESS' ||
    localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION
  ) {
    const sheetsData = await api_clients.fetchGSheetsData();
    const setsData = await api_clients.fetchTcgSets();

    store.storeData(sheetsData, setsData);
  }
  (document.getElementById('form') as HTMLFormElement).action =
    constants.APPSCRIPT_URL;
  setEventListeners();
  ui.initPageUi();
  store.logSuccess();
}

/**
 * sets event listeners for navbar
 */
function setEventListeners() {
  document
    .getElementById('binderDropdown')
    ?.addEventListener('change', () => ui.selectNewBinder(false));
  document
    .getElementById('set-dropdown')
    ?.addEventListener('change', () => ui.selectNewSet(false));
  document
    .getElementById('pullOneButton')
    ?.addEventListener('click', () => pullCards(1));
  document
    .getElementById('pullFiveButton')
    ?.addEventListener('click', () => pullCards(5));
  document
    .getElementById('pullTenButton')
    ?.addEventListener('click', () => pullCards(10));
  document
    .getElementById('clearDisplayButton')
    ?.addEventListener('click', clearDisplay);
  document.getElementById('syncButton')?.addEventListener('click', loadPage);
  ui.addShowHideToggle('display-btn', 'display-dropdown');
}

/**
 * clears this session's pulled cards from display
 */
function clearDisplay() {
  const largeCardSpan = document.getElementById('largeCardSpan');
  const smallCardSpan = document.getElementById('smallCardSpan');
  const listSpan = document.getElementById('listSpan');

  if (largeCardSpan) largeCardSpan.innerHTML = '';
  if (smallCardSpan) smallCardSpan.innerHTML = '';

  const ol = document.createElement('ol');
  ol.id = 'cardList';
  ol.reversed = true;
  if (listSpan) {
    listSpan.innerHTML = '';
    listSpan.appendChild(ol);
  }
}

/**
 * does all the stuff to pull the card
 * TODO: can refactor this more
 * @param n number of cards to pull
 */
function pullCards(n: number) {
  const collectionType = localStorage.getItem('collection_type') ?? 'binder';
  const storageKey =
    collectionType === 'binder' ? 'active_binder' : 'active_set';
  const activeCollection = localStorage.getItem(storageKey);
  const data = activeCollection
    ? JSON.parse(localStorage.getItem(activeCollection) ?? '[]')
    : [];

  const cardPool = data.map((row: string[]) =>
    constants.getCellValue('filename', row, null)
  );
  const pulled: number[] = [];

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * cardPool.length);
    pulled.push(x);
  }

  processPulled(pulled, data);
}

/**
 *
 * @param pulled index numbers in the filenames array
 * @param data data for the current collection
 */
function processPulled(pulled: number[], data: string[][]) {
  const newCards: string[] = [];
  const currentPulls: HTMLImageElement[] = [];
  pulled.forEach((card: number) => {
    const binderRow = data[card] ?? [];
    const { title, dir, filename, caught, borderColors } =
      getCardMetadata(binderRow);
    const small = generateImg('small', dir, filename, caught, borderColors);
    const smallCardSpan = document.getElementById('smallCardSpan');
    smallCardSpan?.insertBefore(small, smallCardSpan.firstChild);
    currentPulls.push(
      generateImg('large', dir, filename, caught, borderColors)
    );
    if (!caught) {
      newCards.push(filename);
    }
    addToList(title);
  });
  displayLarge(currentPulls);
  if (newCards.length) {
    processNewCards(newCards);
  }
}

/**
 *
 * @param binderRow full row
 * @returns
 */
function getCardMetadata(binderRow: string[]): {
  title: string;
  dir: string;
  filename: string;
  caught: string;
  borderColors: string;
} {
  const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
  const filename = constants.getCellValue('filename', binderRow, header);
  const caught = constants.getCellValue('caught', binderRow, header);
  const cardtype = constants.getCellValue('cardtype', binderRow, header);
  const energytype = constants.getCellValue('energytype', binderRow, header);
  const set = constants.getCellValue('set', binderRow, header);
  const visuals = constants.getCellValue('visuals', binderRow, header);
  const binder = constants.getCellValue('binder', binderRow, header);
  let title = `${filename} : ${visuals} : binder: ${binder}`;
  if (!caught) {
    title += ` ✨NEW✨`;
  }
  const borderColors = page.generateBorderColors(cardtype, energytype);
  const dir = `img/${set.toLowerCase()}`;
  return { title, dir, filename, caught, borderColors };
}

/**
 * generates img element for small or large cards on pull page
 * @param size 'large' or 'small'
 * @param dir
 * @param filename
 * @param caught
 * @param borderColors
 * @returns
 */
function generateImg(
  size: string,
  dir: string,
  filename: string,
  caught: string,
  borderColors: string
): HTMLImageElement {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  if (size == 'small') {
    img.classList.add('small-card');
    img.onclick = function () {
      displayLarge([generateImg('large', dir, filename, caught, borderColors)]);
    };
  } else if (size == 'large') {
    img.classList.add('large-card');
  }
  if (caught) {
    img.classList.add('caught');
  }
  img.style.setProperty(
    'background',
    `linear-gradient(to bottom right, ${borderColors}) border-box`
  );
  return img;
}

/**
 * displays large cards for the current pull
 * @param imgs
 */
function displayLarge(imgs: HTMLImageElement[]) {
  const largeCardSpan = document.getElementById('largeCardSpan');
  const newSpan = document.createElement('span');
  newSpan.id = 'largeCardSpan';
  imgs.forEach((img) => {
    newSpan.insertBefore(img, newSpan.firstChild);
  });
  largeCardSpan?.replaceWith(newSpan);
}

/**
 * displays titles of current pulls to the list
 * @param title
 */
function addToList(title: string) {
  const ol = document.getElementById('cardList');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(title));
  ol?.insertBefore(li, ol.firstChild);
}

/**
 * updates stored data and progress bar with new cards, then submits to gSheet
 * @param newCards array of filenames
 */
function processNewCards(newCards: string[]) {
  updateNewCardsInCache(newCards);
  ui.generateProgressBar();
  (document.getElementById('filenamesInput') as HTMLInputElement).value =
    JSON.stringify(newCards);
  (document.getElementById('form') as HTMLFormElement).submit();
}

/**
 * updates stored data (handles both binders and sets)
 * @param newCards array of filenames
 */
function updateNewCardsInCache(newCards: string[]) {
  const activeBinder = localStorage.getItem('active_binder') ?? '';
  const binderData = JSON.parse(localStorage.getItem(activeBinder) ?? '[]');
  const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
  newCards.forEach((filename) => {
    for (let rowNum = 0; rowNum < binderData.length; rowNum++) {
      if (
        constants.getCellValue('filename', binderData[rowNum], header) ==
        filename
      ) {
        binderData[rowNum][header.indexOf('caught')] = 'x';
        break;
      }
    }
    // each card may have a different set, so need to handle storage individually
    const matchResult = filename.match(/^[^\.]*/) ?? '';
    const setName = matchResult[0].toUpperCase();
    const setData = JSON.parse(localStorage.getItem(setName) ?? '');
    for (let rowNum = 0; rowNum < setData.length; rowNum++) {
      if (
        constants.getCellValue('filename', setData[rowNum], header) == filename
      ) {
        setData[rowNum][header.indexOf('caught')] = 'x';
        localStorage.setItem(setName, JSON.stringify(setData));
        break;
      }
    }
  });
  // only set after all cards are updated
  localStorage.setItem(activeBinder, JSON.stringify(binderData));
}
