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

function _fillLotto(picked_card_row) {
  getConstantsFromStorage();

  const dir = `img/${BINDER_DATA[picked_card_row][jset].toLowerCase()}`;
  const filename = BINDER_DATA[picked_card_row][FILENAME_COL];
  const pkmntype = BINDER_DATA[picked_card_row][PKMNTYPE_COL];
  const cardtype = BINDER_DATA[picked_card_row][CARDTYPE_COL];
  const caught = BINDER_DATA[picked_card_row][CAUGHT_COL];
  const title = `'${filename} : ${pkmntype} : ${cardtype}'`;

  document.getElementById('id-filename').value = filename;
  addCardToList(filename, caught, dir, title);
  if (!caught) {
    document.getElementById('form').submit();
  }

  let special;
  if (BINDER_DATA[picked_card_row][CARDTYPE_COL] != 'basic') {
    special = CARD_HEX_COLORS[cardtype].join(',');
  }

  let border_colors;
  const light = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][0];
  const dark = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }

  const newContent = `<img src='${dir}/${filename}' title=${title} style='height:500px;border-radius:15px' />`;
  document.getElementById('content').innerHTML = newContent;

  const backgroundStyle = `linear-gradient(to bottom right, ${border_colors}) border-box`;
  document.getElementsByTagName('body')[0].style.background = backgroundStyle;
  document.getElementsByTagName('body')[0].style.backgroundRepeat = 'no-repeat';
  document.getElementsByTagName('body')[0].style.minHeight = '100vh';

  document.getElementById('status').innerHTML = '';
}

function lotto() {
  const cardPool = JSON.parse(localStorage.filenames);
  x = getRandomInt(0, cardPool.length);
  _fillLotto(x);
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive.
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function addCardToList(filename, caught, dir, title) {
  const ol = document.getElementById('card-list');
  const li = document.createElement('li');
  const img = document.createElement('img');
  const div = document.getElementById('card-list-div');
  let textnode = filename;
  img.src = `${dir}/${filename}`;
  img.style.height = '100px';

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
