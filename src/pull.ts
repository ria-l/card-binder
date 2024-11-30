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
  console.log('loading from storage');
  ui.generateBinderDropdown();
  ui.generateSetDropdown();
  const container = localStorage.getItem('container');
  if (container == 'binder') {
    ui.highlightBinder();
  } else if (container == 'set') {
    ui.highlightSet();
  }
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
    ui.selectNewBinder();
  });
  const setDropdown = document.getElementById('setDropdown');
  setDropdown.addEventListener('change', function () {
    ui.selectNewSet();
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
  ui.addShowHideToggle('display-btn', 'display-dropdown');
}

function clearDisplay() {
  document.getElementById('largeCardSpan').innerHTML = '';
  document.getElementById('smallCardSpan').innerHTML = '';
  document.getElementById('listSpan').innerHTML = '';
  const listSpan = document.getElementById('listSpan');
  const ol = document.createElement('ol');
  ol.id = 'cardList';
  ol.reversed = true;
  listSpan.appendChild(ol);
}

/**
 *
 * @param {int} n number of cards pulled
 */
function pullCards(n) {
  const container = localStorage.getItem('container');
  let data;
  if (container == 'binder' || !container) {
    const bindername = localStorage.getItem('bindername');
    data = JSON.parse(localStorage.getItem(bindername));
  } else {
    const setname = localStorage.getItem('setname');
    data = JSON.parse(localStorage.getItem(setname));
  }
  const cardPool = data.map((row) => constants.getMetadatum('filename', row));
  let pulled = [];
  for (let i = 0; i < n; i++) {
    // max val is length - 1
    const x = Math.floor(Math.random() * cardPool.length);
    pulled.push(x);
  }
  processPulled(pulled, data);
}

/**
 *
 * @param {array of ints} pulled index numbers in the filenames array
 */
function processPulled(pulled, data) {
  const newCards = [];
  const currentPulls = [];
  pulled.forEach((card) => {
    const binderRow = data[card];
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
  const header = localStorage.getItem('header').split(',');
  const filename = constants.getMetadatum('filename', binderRow, header);
  const caught = constants.getMetadatum('caught', binderRow, header);
  const cardtype = constants.getMetadatum('cardtype', binderRow, header);
  const energytype = constants.getMetadatum('energytype', binderRow, header);
  const set = constants.getMetadatum('set', binderRow, header);
  let title = `${filename} : ${energytype} : ${cardtype}`;
  if (!caught) {
    title += ` ✨NEW✨`;
  }
  const borderColors = page.generateBorderColors(cardtype, energytype);
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
  const header = localStorage.getItem('header').split(',');
  newCards.forEach((filename) => {
    for (let rowNum = 0; rowNum < binderData.length; rowNum++) {
      if (
        constants.getMetadatum('filename', binderData[rowNum], header) ==
        filename
      ) {
        binderData[rowNum][header.indexOf('caught')] = 'x';
        break;
      }
    }
    // each card may have a different set, so need to handle storage individually
    const setName = filename.match(/^[^\.]*/)[0].toUpperCase();
    const setData = JSON.parse(localStorage.getItem(setName));
    for (let rowNum = 0; rowNum < setData.length; rowNum++) {
      if (
        constants.getMetadatum('filename', setData[rowNum], header) == filename
      ) {
        setData[rowNum][header.indexOf('caught')] = 'x';
        localStorage.setItem(setName, JSON.stringify(setData));
        break;
      }
    }
  });
  // only set after all cards are updated
  localStorage.setItem(binderName, JSON.stringify(binderData));
}
