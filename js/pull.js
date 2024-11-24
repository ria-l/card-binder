import * as constants from './constants.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as page from './page.js';
import * as app from './app.js';

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
  constants.initialize();
  console.log('loading from storage');
  ui.populateBinderDropdown();
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
 * filenames is set in binder.storeFileNames
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
 * @param {array of ints} picked_cards index numbers in the filenames array
 */
function processPulled(pulled_cards) {
  const binderName = localStorage.getItem('bindername');
  const binderData = JSON.parse(localStorage.getItem(binderName));
  const newCards = [];
  const largeArr = [];
  pulled_cards.forEach((cardRow) => {
    const filename = binderData[cardRow][constants.FILENAME_COL];
    const caught = binderData[cardRow][constants.CAUGHT_COL];
    const cardtype = binderData[cardRow][constants.CARDTYPE_COL];
    const pkmntype = binderData[cardRow][constants.PKMNTYPE_COL];
    const set = binderData[cardRow][constants.SET_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    const borderColors = page.generateBorderColors(cardRow, cardtype);
    const dir = `img/${set.toLowerCase()}`;

    displaySmall(filename, title, caught, dir, borderColors);
    largeArr.push(generateImg('large', dir, filename, caught, borderColors));
    if (!caught) {
      newCards.push(filename);
    }
  });
  displayLarge(largeArr);
  if (newCards.length) {
    markCardAsPulled(newCards);
    submitForm(newCards);
  }
}

function generateImg(size, dir, filename, caught, borderColors) {
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

function displaySmall(filename, title, caught, dir, borderColors) {
  const ol = document.getElementById('cardList');
  const li = generateLi(title, caught);
  ol.insertBefore(li, ol.firstChild);
  const right = document.getElementById('smallCardSpan');
  const small = generateImg('small', dir, filename, caught, borderColors);
  small.onclick = function () {
    displayLarge([generateImg('large', dir, filename, caught, borderColors)]);
  };
  right.insertBefore(small, ol);
}

function displayLarge(arr) {
  const left = document.getElementById('largeCardSpan');
  const newLeft = document.createElement('span');
  newLeft.id = 'largeCardSpan';
  arr.forEach((element) => {
    newLeft.appendChild(element);
  });
  left.replaceWith(newLeft);
}

function generateLi(title, caught) {
  const li = document.createElement('li');
  let textnode = title;
  if (!caught) {
    textnode += ` ✨NEW✨`;
  }
  li.appendChild(document.createTextNode(textnode));
  return li;
}

/**
 *
 * @param {array of strings} filenames
 */
function submitForm(filenames) {
  document.getElementById('id-filename').value = JSON.stringify(filenames);
  document.getElementById('form').submit();
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
 *
 * @param {array of strings} newCards filenames
 */
function markCardAsPulled(newCards) {
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
