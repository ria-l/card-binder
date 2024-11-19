window.onload = () => {
  document.getElementById('form').action = appscript_url;
  if (localStorage.getItem('filenames')) {
    console.log('already stored');
    populateDropdown();
  } else {
    fetchAndStoreBinders();
  }
};

async function _fetchData() {
  console.log('fetching...');
  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  const response = await fetch(appscript_url);
  const data = await response.json();
  status.className = 'hidestatus';
  console.log('fetched');

  return data;
}

async function fetchAndStoreBinders() {
  const data = await _fetchData();
  storeBinders(data.data);
  populateDropdown();
}

/**
 *
 * @param {array of ints} picked_cards index numbers in the filenames array
 */
function _fillLotto(picked_cards) {
  getConstantsFromStorage();
  const cardData = [];
  const toSubmit = [];

  picked_cards.forEach((cardRow) => {
    const dir = `img/${BINDER_DATA[cardRow][SET_COL].toLowerCase()}`;
    const filename = BINDER_DATA[cardRow][FILENAME_COL];
    const pkmntype = BINDER_DATA[cardRow][PKMNTYPE_COL];
    const cardtype = BINDER_DATA[cardRow][CARDTYPE_COL];
    const caught = BINDER_DATA[cardRow][CAUGHT_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype}`;

    if (!caught) {
      toSubmit.push(filename);
    }
    _addCardToWinnersList(filename, caught, dir, title, cardRow, cardtype);
    cardData.push({ filename: filename, dir: dir, title: title });
    _displayWinner(cardData, cardRow, cardtype);
  });
  if (toSubmit.length) {
    _submitForm(toSubmit);
  }
}

/**
 *
 * @param {array of strings} filenames
 */
function _submitForm(filenames) {
  document.getElementById('id-filename').value = JSON.stringify(filenames);
  document.getElementById('form').submit();
}

/**
 *
 * @param {array of objects} cardData { filename: filename, dir: dir, title: title }
 * @param {int} cardRow row number
 * @param {string} cardtype
 */
function _displayWinner(cardData, cardRow, cardtype) {
  const newSpan = document.createElement('span');
  newSpan.id = 'winner';
  cardData.forEach((card) => {
    cardData[0]['filename'];

    const img = document.createElement('img');
    img.src = `${card['dir']}/${card['filename']}`;
    img.title = card['title'];
    img.id = 'caught-card';

    const border_colors = generateBorderColors(cardRow, cardtype);
    img.style.background = `linear-gradient(to bottom right, ${border_colors}) border-box`;
    img.style.border = 'solid 20px transparent';
    img.style.borderRadius = '16px';
    newSpan.appendChild(img);
  });
  const oldSpan = document.getElementById('winner');
  document.getElementById('content').replaceChild(newSpan, oldSpan);
}

function lotto(n) {
  const cardPool = JSON.parse(localStorage.filenames);

  let picked = [];
  for (let i = 0; i < n; i++) {
    x = getRandomInt(0, cardPool.length);
    picked.push(x);
  }
  _fillLotto(picked);
}

/**
 * Min and max are inclusive.
 * @param {int} min
 * @param {int} max
 * @returns {int}
 */
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max + 1);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function _addCardToWinnersList(
  filename,
  caught,
  dir,
  title,
  cardRow,
  cardtype
) {
  const ol = document.getElementById('card-list');
  const li = document.createElement('li');
  const img = document.createElement('img');
  const div = document.getElementById('card-list-div');
  let textnode = title;
  img.src = `${dir}/${filename}`;
  img.style.height = '100px';
  const border_colors = generateBorderColors(cardRow, cardtype);
  img.style.background = `linear-gradient(to bottom right, ${border_colors}) border-box`;
  img.style.border = 'solid 5px transparent';
  img.style.borderRadius = '5px';
  img.style.margin = '3px';

  if (!caught) {
    textnode = `✨NEW✨${title}`;
  } else {
    img.style.opacity = '50%';
  }
  div.insertBefore(img, ol);
  li.appendChild(document.createTextNode(textnode));
  ol.insertBefore(li, ol.firstChild);
}

function clearList() {
  const div = document.getElementById('card-list-div');
  div.innerHTML = '';
  div.innerHTML = '<ol reversed id="card-list"></ol>';
}
