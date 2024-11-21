function storeBinders(data) {
  // puts binder names into a set
  const header = data[0];
  let bindername = localStorage.getItem('bindername');
  localStorage.setItem('header', header);
  if (!bindername) {
    bindername = header[0]; // TODO: make this random
    localStorage.setItem('bindername', bindername);
  }
  const binderNames = new Set();
  const binderIndex = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }

  // parses and stores binder data
  for (const name of binderNames) {
    // only the cards that are in the given binder
    filtered = data.filter((row) => row[binderIndex] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    if (name == 'illust') {
      toStore = sortByDex(filtered);
    } else {
      toStore = sortByColor(filtered);
    }
    localStorage.setItem(name, JSON.stringify(toStore));
  }
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
  _storeFileNames(bindername);
  console.log('stored binders');
}

function _storeFileNames(binder) {
  getConstantsFromStorage();
  data = JSON.parse(localStorage.getItem(binder));
  const filenames = data.map((row) => row[FILENAME_COL]);
  localStorage.setItem('filenames', JSON.stringify([...filenames]));
  console.log(`stored filenames for ${binder}`);
}

function selectNewBinder(source) {
  const select = document.getElementById('selectBinder');
  const bindername = select.options[select.selectedIndex].text;
  localStorage.setItem('bindername', bindername);
  if (source == 'fillbinder') {
    fillBinder();
  }
  createProgressBar();
  _storeFileNames(bindername);
}

function fillBinder() {
  const binderContent = _createBinderContent();
  document.getElementById('content').innerHTML = '';
  binderContent.forEach((item) => {
    document.getElementById('content').appendChild(item);
  });

  console.log('filled binder');
}

function _createBinderContent() {
  const cardTags = _createCardTags();
  const rows = parseInt(document.getElementById('row-dropdown').selectedIndex);

  const cols = parseInt(document.getElementById('col-dropdown').selectedIndex);

  const allTables = [];
  let currentTable;
  let currentRow;

  cardTags.forEach((tag, i) => {
    if (!rows || !cols) {
      allTables.push(tag);
      const spaceNode = document.createTextNode(' ');
      allTables.push(spaceNode);
    } else {
      // Use the remainder value from the modulo function to put each card into a row/grid bucket.
      const rowIndex = (i + 1) % cols;
      const gridIndex = (i + 1) % (rows * cols);

      const table = document.createElement('table');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.appendChild(tag);

      // first card in grid
      if (gridIndex == 1) {
        currentTable = table;
      }

      // middle cards
      if (rowIndex == 1) {
        // first card in row
        currentRow = tr;
        currentRow.appendChild(td);
      } else if (rowIndex == 0) {
        // last card in row
        if (cols == 1) {
          currentRow = tr;
        }
        if (rows == 1) {
          currentTable = table;
        }
        currentRow.appendChild(td);
        currentTable.appendChild(currentRow);
      } else {
        currentRow.appendChild(td);
      }

      // last card in grid
      if (gridIndex == 0) {
        if (cols == 1) {
          currentRow = tr;
        }
        if (rows == 1) {
          currentTable = table;
        }
        allTables.push(currentTable);
        currentTable = null;
      }
      // Any cards that don't fit neatly into the grid
      if (currentTable) {
        currentTable.appendChild(currentRow);
        allTables.push(currentTable);
      }
    }
  });
  return allTables;
}

function _createCardTags() {
  getConstantsFromStorage();
  const cardSize = document.getElementById('inputCardSize').value;
  const tags = [];
  for (var card = 0; card < BINDER_DATA.length; card++) {
    const dir = `img/${BINDER_DATA[card][SET_COL].toLowerCase()}`;
    const filename = BINDER_DATA[card][FILENAME_COL];
    const pkmntype = BINDER_DATA[card][PKMNTYPE_COL];
    const cardtype = BINDER_DATA[card][CARDTYPE_COL];
    const cardsubtype = BINDER_DATA[card][CARDSUBTYPE_COL];

    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    if (BINDER_DATA[card][CAUGHT_COL] == 'x') {
      _generateImgTag(tags, dir, filename, title, cardSize);
    } else {
      _generatePlaceholder(card, cardtype, cardsubtype, cardSize, tags, title);
    }
  }
  console.log('created tags');
  return tags;
}

function _generateImgTag(tags, dir, filename, title, cardSize) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');

  tags.push(img);
}

function _generatePlaceholder(i, cardtype, cardsubtype, cardSize, tags, title) {
  // note that there are a couple other styles in the css file

  const border_colors = generateBorderColors(i, cardtype);
  let fill_colors;
  if (cardsubtype.includes('gold')) {
    fill_colors = `#fef081,#c69221,#fef081,white 25%,#f9f9f9,white,#f9f9f9`;
  } else {
    fill_colors = `#f9f9f9,white,#f9f9f9,white,#f9f9f9`;
  }

  const span = document.createElement('span');
  span.className = 'placeholder';
  span.title = title;
  span.style.width = `${cardSize}px`;
  span.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  span.style.background = `linear-gradient(to bottom right, ${fill_colors}) padding-box, linear-gradient(to bottom right, ${border_colors}) border-box`;
  span.style.borderRadius = `${cardSize / 20}px`;
  span.style.border = `${cardSize / 15}px solid transparent`;

  tags.push(span);
}

/**
 *
 * @param {array of strings} freshlyCaught filenames
 */
function _updateBinderData(freshlyCaught) {
  freshlyCaught.forEach((filename) => {
    for (let i = 0; i < BINDER_DATA.length; i++) {
      if (BINDER_DATA[i][FILENAME_COL] == filename) {
        BINDER_DATA[i][CAUGHT_COL] = 'x';
        break;
      }
    }
  });
  localStorage.setItem(BINDER_NAME, JSON.stringify(BINDER_DATA));
  createProgressBar();
}
