import * as app from './app.js';
import * as constants from './constants.js';
import * as page from './page.js';
import * as store from './store.js';
import * as ui from './ui.js';

window.onload = () => {
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
  const clearPullsButton = document.getElementById('clearPullsButton');
  clearPullsButton.addEventListener('click', function () {
    clearPulledList();
  });
  const syncButton = document.getElementById('syncButton');
  syncButton.addEventListener('click', function () {
    fetchAndInitializePull();
  });
}

/**
 * Used for button click
 */
function clearPulledList() {
  const right = document.getElementById('smallCardSpan');
  right.innerHTML = '<ol reversed id="cardList"></ol>';
  const left = document.getElementById('largeCardSpan');
  left.innerHTML = '';
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
  const largeArr = [];
  pulled.forEach((cardRow) => {
    const filename = binderData[cardRow][constants.FILENAME_COL];
    const caught = binderData[cardRow][constants.CAUGHT_COL];
    const cardtype = binderData[cardRow][constants.CARDTYPE_COL];
    const pkmntype = binderData[cardRow][constants.PKMNTYPE_COL];
    const set = binderData[cardRow][constants.SET_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    const borderColors = page.generateBorderColors(cardtype, pkmntype);
    const dir = `img/${set.toLowerCase()}`;

    _displaySmall(filename, title, caught, dir, borderColors);
    largeArr.push(_generateImg('large', dir, filename, caught, borderColors));
    if (!caught) {
      newCards.push(filename);
    }
  });
  _displayLarge(largeArr);
  if (newCards.length) {
    _markCardAsPulled(newCards);
    _submitForm(newCards);
  }
}

function _generateImg(size, dir, filename, caught, borderColors) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  if (size == 'small') {
    img.classList.add('small-card');
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

function _displaySmall(filename, title, caught, dir, borderColors) {
  const ol = document.getElementById('cardList');
  const li = document.createElement('li');
  if (!caught) {
    title += ` ✨NEW✨`;
  }
  li.appendChild(document.createTextNode(title));
  ol.insertBefore(li, ol.firstChild);
  const smallCardSpan = document.getElementById('smallCardSpan');
  const small = _generateImg('small', dir, filename, caught, borderColors);
  small.onclick = function () {
    _displayLarge([_generateImg('large', dir, filename, caught, borderColors)]);
  };
  smallCardSpan.insertBefore(small, ol);
}

function _displayLarge(imgs) {
  const largeCardSpan = document.getElementById('largeCardSpan');
  const newSpan = document.createElement('span');
  newSpan.id = 'largeCardSpan';
  imgs.forEach((img) => {
    newSpan.appendChild(img);
  });
  largeCardSpan.replaceWith(newSpan);
}

/**
 *
 * @param {array of strings} newCards filenames
 */
function _markCardAsPulled(newCards) {
  const binderName = localStorage.getItem('bindername');
  const binderData = JSON.parse(localStorage.getItem(binderName));

  newCards.forEach((filename) => {
    for (let i = 0; i < binderData.length; i++) {
      if (binderData[i][constants.FILENAME_COL] == filename) {
        binderData[i][constants.CAUGHT_COL] = 'x';
        break;
      }
    }
  });

  localStorage.setItem(binderName, JSON.stringify(binderData));
  ui.createProgressBar();
}

/**
 *
 * @param {array of strings} filenames
 */
function _submitForm(filenames) {
  document.getElementById('id-filename').value = JSON.stringify(filenames);
  document.getElementById('form').submit();
}
