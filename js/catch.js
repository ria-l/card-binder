window.onload = () => {
  document.getElementById('form').action = appscript_url;
  if (localStorage.length > 0) {
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

function _fillLotto(picked_cards) {
  getConstantsFromStorage();
  const cardData = [];

  picked_cards.forEach((cardRow) => {
    const dir = `img/${BINDER_DATA[cardRow][SET_COL].toLowerCase()}`;
    const filename = BINDER_DATA[cardRow][FILENAME_COL];
    const pkmntype = BINDER_DATA[cardRow][PKMNTYPE_COL];
    const cardtype = BINDER_DATA[cardRow][CARDTYPE_COL];
    const caught = BINDER_DATA[cardRow][CAUGHT_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype}`;

    // Needed for form submit
    document.getElementById('id-filename').value = filename;
    if (!caught) {
      document.getElementById('form').submit();
    }

    _addCardToWinnersList(filename, caught, dir, title, cardRow, cardtype);
    _setBackgroundColors(cardRow);
    cardData.push({ filename: filename, dir: dir, title: title });
  });
  _displayWinner(cardData);
}

function _displayWinner(cardData) {
  const newSpan = document.createElement('span');
  newSpan.id = 'winner';
  cardData.forEach((card, i) => {
    cardData[0]['filename'];

    const img = document.createElement('img');
    img.src = `${card['dir']}/${card['filename']}`;
    img.title = card['title'];
    img.className = 'caught-card';
    newSpan.appendChild(img);
  });
  const oldSpan = document.getElementById('winner');
  document.getElementById('content').replaceChild(newSpan, oldSpan);
}

function _setBackgroundColors(picked_card_row) {
  const cardtype = BINDER_DATA[picked_card_row][CARDTYPE_COL];

  const border_colors = generateBorderColors(picked_card_row, cardtype);

  const body = document.getElementsByTagName('body')[0];
  body.style.background = `linear-gradient(to bottom right, ${border_colors}) border-box`;
  body.style.backgroundRepeat = 'no-repeat';
  body.style.minHeight = '100vh';
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

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive.
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
