window.onload = () => {
  document.getElementById('form').action = APPSCRIPT_URL;
  PULL_initialize('onload');
};

async function PULL_initialize(source) {
  if (localStorage.getItem('bindername') && source == 'onload') {
    console.log('already stored');
  } else {
    const data = await PULL_fetchData();
    STORE_storeData(data.data);
  }
  UI_populateBinderDropdown();
  UI_createProgressBar();
}

async function PULL_fetchData() {
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
 * filenames is set in binder.STORE_storeFileNames
 * @param {int} n number of cards pulled
 */
function PULL_pull(n) {
  const cardPool = JSON.parse(localStorage.getItem('binder_filenames'));
  let pulled = [];
  for (let i = 0; i < n; i++) {
    // max val is length - 1
    x = Math.floor(Math.random() * cardPool.length);
    pulled.push(x);
  }
  PULL_processPulled(pulled);
}

/**
 *
 * @param {array of ints} picked_cards index numbers in the filenames array
 */
function PULL_processPulled(pulled_cards) {
  CONSTANTS_initialize();
  const newCards = [];
  const largeArr = [];
  pulled_cards.forEach((cardRow) => {
    const filename = BINDER_DATA[cardRow][FILENAME_COL];
    const caught = BINDER_DATA[cardRow][CAUGHT_COL];
    const cardtype = BINDER_DATA[cardRow][CARDTYPE_COL];
    const pkmntype = BINDER_DATA[cardRow][PKMNTYPE_COL];
    const set = BINDER_DATA[cardRow][SET_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    const borderColors = PAGE_generateBorderColors(cardRow, cardtype);
    const dir = `img/${set.toLowerCase()}`;

    PULL_displaySmall(filename, title, caught, dir, borderColors);
    largeArr.push(
      PULL_generateImg('large', dir, filename, caught, borderColors)
    );
    if (!caught) {
      newCards.push(filename);
    }
  });
  PULL_displayLarge(largeArr);
  if (newCards.length) {
    PULL_updateBinderData(newCards);
    PULL_submitForm(newCards);
  }
}

function PULL_generateImg(size, dir, filename, caught, borderColors) {
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

function PULL_displaySmall(filename, title, caught, dir, borderColors) {
  const ol = document.getElementById('card-list');
  const li = PULL_generateLi(title, caught);
  ol.insertBefore(li, ol.firstChild);
  const right = document.getElementById('card-list-div');
  const small = PULL_generateImg('small', dir, filename, caught, borderColors);
  small.onclick = function () {
    PULL_displayLarge([
      PULL_generateImg('large', dir, filename, caught, borderColors),
    ]);
  };
  right.insertBefore(small, ol);
}

function PULL_displayLarge(arr) {
  const left = document.getElementById('winner');
  const newLeft = document.createElement('span');
  newLeft.id = 'winner';
  arr.forEach((element) => {
    newLeft.appendChild(element);
  });
  left.replaceWith(newLeft);
}

function PULL_generateLi(title, caught) {
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
function PULL_submitForm(filenames) {
  document.getElementById('id-filename').value = JSON.stringify(filenames);
  document.getElementById('form').submit();
}

/**
 * Used for button click
 */
function PULL_clearPulledList() {
  const right = document.getElementById('card-list-div');
  right.innerHTML = '<ol reversed id="card-list"></ol>';
  const left = document.getElementById('winner');
  left.innerHTML = '';
}

/**
 *
 * @param {array of strings} newCards filenames
 */
function PULL_updateBinderData(newCards) {
  newCards.forEach((filename) => {
    for (let i = 0; i < BINDER_DATA.length; i++) {
      if (BINDER_DATA[i][FILENAME_COL] == filename) {
        BINDER_DATA[i][CAUGHT_COL] = 'x';
        break;
      }
    }
  });
  localStorage.setItem(BINDER_NAME, JSON.stringify(BINDER_DATA));
  UI_createProgressBar();
}
