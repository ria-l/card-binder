window.onload = () => {
  document.getElementById('form').action = APPSCRIPT_URL;
  initializeCatchPage('onload');
};

async function initializeCatchPage(source) {
  if (localStorage.getItem('bindername') && source == 'onload') {
    console.log('already stored');
  } else {
    const data = await _fetchData();
    storeBinders(data.data);
  }
  populateDropdown();
  createProgressBar();
}

async function _fetchData() {
  console.log('fetching...');
  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  const response = await fetch(APPSCRIPT_URL);
  const data = await response.json();
  status.className = 'hidestatus';
  console.log('fetched');

  return data;
}

/**
 * filenames is set in binder._storeFileNames
 * @param {int} n number of cards pulled 
 */
function lotto(n) {
  const cardPool = JSON.parse(localStorage.filenames);

  let picked = [];
  for (let i = 0; i < n; i++) {
    // max val is length - 1
    x = Math.floor(Math.random() * cardPool.length);
    picked.push(x);
  }
  processPicked(picked);
}

/**
 *
 * @param {array of ints} picked_cards index numbers in the filenames array
 */
function processPicked(picked_cards) {
  getConstantsFromStorage();
  const freshlyCaught = [];
  const largeArr = [];
  picked_cards.forEach((cardRow) => {
    const filename = BINDER_DATA[cardRow][FILENAME_COL];
    const caught = BINDER_DATA[cardRow][CAUGHT_COL];
    const cardtype = BINDER_DATA[cardRow][CARDTYPE_COL];
    const pkmntype = BINDER_DATA[cardRow][PKMNTYPE_COL];
    const set = BINDER_DATA[cardRow][SET_COL];

    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    const borderColors = generateBorderColors(cardRow, cardtype);
    const dir = `img/${set.toLowerCase()}`;

    _displaySmall(filename, title, caught, dir, borderColors);
    largeArr.push(_createImg('large', dir, filename, caught, borderColors));

    if (!caught) {
      freshlyCaught.push(filename);
    }
  });
  _displayLarge(largeArr);
  if (freshlyCaught.length) {
    _updateBinderData(freshlyCaught)
    _submitForm(freshlyCaught);
  }
}

function _createImg(size, dir, filename, caught, borderColors) {
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
  const ol = document.getElementById('card-list');
  const li = _createLi(title, caught);
  ol.insertBefore(li, ol.firstChild);

  const right = document.getElementById('card-list-div');
  const small = _createImg('small', dir, filename, caught, borderColors);
  small.onclick = function () {
    _displayLarge([_createImg('large', dir, filename, caught, borderColors)]);
  };
  right.insertBefore(small, ol);
}

function _displayLarge(arr) {
  const left = document.getElementById('winner');
  const newLeft = document.createElement('span');
  newLeft.id = 'winner';
  arr.forEach((element) => {
    newLeft.appendChild(element);
  });
  left.replaceWith(newLeft);
}

function _createLi(title, caught) {
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
function _submitForm(filenames) {
  document.getElementById('id-filename').value = JSON.stringify(filenames);
  document.getElementById('form').submit();
}

/**
 * Used for button click
 */
function clearList() {
  const right = document.getElementById('card-list-div');
  right.innerHTML = '<ol reversed id="card-list"></ol>';
  const left = document.getElementById('winner');
  left.innerHTML = '';
}
