import * as app from './app.js';
import * as constants from './constants.js';
import * as page from './page.js';
import * as store from './store.js';
import * as ui from './ui.js';

window.onload = () => {
  ui.setBg();
  document.getElementById('form').action = constants.APPSCRIPT_URL;
  if (localStorage.getItem('pull_status') == 'SUCCESS') {
    initializePull();
  } else {
    fetchAndInitializePull();
  }
  setEventListeners();
};

function initializePull() {
  constants.initializeConsts();
  console.log('loading from storage');
  ui.generateBinderDropdown();
  ui.createProgressBar();
  localStorage.setItem('pull_status', 'SUCCESS');
}

async function fetchAndInitializePull() {
  const data = await app.fetchData();
  store.storeData(data.data);
  initializePull();
}

function setEventListeners() {
  const binderDropdown = document.getElementById('binderDropdown');
  binderDropdown.addEventListener('change', function () {
    ui.selectNewBinder('storefilenames');
  });
  const pullOneButton = document.getElementById('pullOneButton');
  pullOneButton.addEventListener('click', function () {
    pullCards(1);
  });
  const pullFiveButton = document.getElementById('pullFiveButton');
  pullFiveButton.addEventListener('click', function () {
    pullCards(5);
  });
  const pullTenButton = document.getElementById('pullTenButton');
  pullTenButton.addEventListener('click', function () {
    pullCards(10);
  });
  const clearDisplayButton = document.getElementById('clearDisplayButton');
  clearDisplayButton.addEventListener('click', function () {
    clearDisplay();
  });
  const syncButton = document.getElementById('syncButton');
  syncButton.addEventListener('click', function () {
    fetchAndInitializePull();
  });
}

function clearDisplay() {
  document.getElementById('largeCardSpan').innerHTML = '';
  document.getElementById('smallCardSpan').innerHTML = '';
  const listSpan = document.getElementById('listSpan');
  listSpan.innerHTML = '';
  const ol = document.createElement('ol');
  ol.id = 'cardList';
  ol.reversed = true;
  listSpan.appendChild(ol);
}

/**
 * filenames is set in storeFileNames
 * @param {int} n number of cards pulled
 */
function pullCards(n) {
  const cardPool = JSON.parse(localStorage.getItem('binder_filenames'));
  let pulled = [];
  for (let i = 0; i < n; i++) {
    // max val is length - 1
    const x = Math.floor(Math.random() * cardPool.length);
    pulled.push(x);
  }
  processPulled(pulled);
}

/**
 *
 * @param {array of ints} pulled index numbers in the filenames array
 */
function processPulled(pulled) {
  const binderName = localStorage.getItem('bindername');
  const binderData = JSON.parse(localStorage.getItem(binderName));
  const newCards = [];
  const currentPulls = [];
  pulled.forEach((card) => {
    const binderRow = binderData[card];
    const { title, dir, filename, caught, borderColors } =
      getCardMetadata(binderRow);
    const small = generateImg('small', dir, filename, caught, borderColors);
    document
      .getElementById('smallCardSpan')
      .insertBefore(small, smallCardSpan.firstChild);
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

function getCardMetadata(binderRow) {
  const filename = binderRow[constants.FILENAME_COL];
  const caught = binderRow[constants.CAUGHT_COL];
  const cardtype = binderRow[constants.CARDTYPE_COL];
  const pkmntype = binderRow[constants.PKMNTYPE_COL];
  const set = binderRow[constants.SET_COL];
  let title = `${filename} : ${pkmntype} : ${cardtype}`;
  if (!caught) {
    title += ` ✨NEW✨`;
  }
  const borderColors = page.generateBorderColors(cardtype, pkmntype);
  const dir = `img/${set.toLowerCase()}`;
  return { title, dir, filename, caught, borderColors };
}

function generateImg(size, dir, filename, caught, borderColors) {
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

function displayLarge(imgs) {
  const largeCardSpan = document.getElementById('largeCardSpan');
  const newSpan = document.createElement('span');
  newSpan.id = 'largeCardSpan';
  imgs.forEach((img) => {
    newSpan.insertBefore(img, newSpan.firstChild);
  });
  largeCardSpan.replaceWith(newSpan);
}

function addToList(title) {
  const ol = document.getElementById('cardList');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(title));
  ol.insertBefore(li, ol.firstChild);
}

function processNewCards(newCards) {
  updateNewCardsInCache(newCards);
  ui.createProgressBar();
  document.getElementById('filenamesInput').value = JSON.stringify(newCards);
  document.getElementById('form').submit();
}

function updateNewCardsInCache(newCards) {
  const binderName = localStorage.getItem('bindername');
  const binderData = JSON.parse(localStorage.getItem(binderName));
  newCards.forEach((filename) => {
    for (let i = 0; i < binderData.length; i++) {
      if (binderData[i][constants.FILENAME_COL] == filename) {
        binderData[i][constants.CAUGHT_COL] = 'x';
        break;
      }
    }
    // each card may have a different set, so need to handle storage individually
    const setName = filename.match(/^[^\.]*/)[0].toUpperCase();
    const setData = JSON.parse(localStorage.getItem(setName));
    for (let i = 0; i < setData.length; i++) {
      if (setData[i][constants.FILENAME_COL] == filename) {
        setData[i][constants.CAUGHT_COL] = 'x';
        localStorage.setItem(setName, JSON.stringify(setData));
        break;
      }
    }
  });
  // only set after all cards are updated
  localStorage.setItem(binderName, JSON.stringify(binderData));
}
