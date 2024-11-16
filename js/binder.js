/**
 * Creates tags from  and stores them in localstorage.
 *
 * @param {Array} values rows of data from the spreadsheet.
 */
function _createCardTags() {
  getConstantsFromStorage();
  const imgWidth = document.getElementById('inputCardSize').value;
  const tags = [];
  for (var card = 0; card < BINDER_DATA.length; card++) {
    const dir = `img/${BINDER_DATA[card][jset].toLowerCase()}`;
    const filename = BINDER_DATA[card][FILENAME_COL];
    const pkmntype = BINDER_DATA[card][PKMNTYPE_COL];
    const cardtype = BINDER_DATA[card][CARDTYPE_COL];
    const cardsubtype = BINDER_DATA[card][CARDSUBTYPE_COL];

    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    if (BINDER_DATA[card][CAUGHT_COL] == 'x') {
      _generateImgTag(tags, dir, filename, title, imgWidth);
    } else {
      _generatePlaceholder(card, cardtype, cardsubtype, imgWidth, tags, title);
    }
  }
  localStorage.setItem('tags', tags);
  console.log('created tags');
}

function _generateImgTag(tags, dir, filename, title, imgWidth) {
  const element = document.createElement('img');
  element.src = `${dir}/${filename}`;
  element.title = title;
  element.style.width = `${imgWidth}px`;
  element.style.height = `${imgWidth * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  element.style.borderRadius = `${imgWidth / 20}px`;

  tags.push(element.outerHTML);
}

function _generatePlaceholder(i, cardtype, cardsubtype, imgWidth, tags, title) {
  // note that there are a couple other styles in the css file
  let special;
  if (BINDER_DATA[i][CARDTYPE_COL] != 'basic') {
    special = CARD_HEX_COLORS[cardtype].join(',');
  }

  let border_colors;
  const light = PKMN_HEX_COLORS[BINDER_DATA[i][PKMNTYPE_COL]][0];
  const dark = PKMN_HEX_COLORS[BINDER_DATA[i][PKMNTYPE_COL]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }

  let fill_colors;
  if (cardsubtype.includes('gold')) {
    fill_colors = `#fef081,#c69221,#fef081,white 25%,#f9f9f9,white,#f9f9f9`;
  } else {
    fill_colors = `#f9f9f9,white,#f9f9f9,white,#f9f9f9`;
  }

  const element = document.createElement('span');
  element.className = 'placeholder';
  element.title = title;
  element.style.width = `${imgWidth}px`;
  element.style.height = `${imgWidth * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  element.style.background = `linear-gradient(to bottom right, ${fill_colors}) padding-box, linear-gradient(to bottom right, ${border_colors}) border-box`;
  element.style.borderRadius = `${imgWidth / 20}px`;
  element.style.border = `${imgWidth / 15}px solid transparent`;
  tags.push(element.outerHTML);
}

/**
 * stores card data for each binder into its own bucket in local storage.
 *
 * @param {array} data data from sheets
 */
function storeBinders(data) {
  // puts binder names into a set
  const header = data[0];
  localStorage.setItem('header', header);
  localStorage.setItem('bindername', header[0]);
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
  console.log('stored binders');
}

function storeNewBinder() {
  select = document.getElementById('selectBinder');
  localStorage.setItem('bindername', select.options[select.selectedIndex].text);
}

function fillBinder() {
  _createCardTags();
  let binderContents = _createBinderContent();

  document.getElementById('content').innerHTML = binderContents;
  console.log('filled binder');
}

function _createBinderContent() {
  const cardTags = localStorage.getItem('tags').split('>,');
  const rows = parseInt(document.getElementById('inputRow').value);
  const cols = parseInt(document.getElementById('inputCol').value);
  let fullTag = '';

  cardTags.forEach((tag, i) => {
    // don't create tables if grid is 0 or blank.
    if (!rows || !cols) {
      fullTag += ` ${tag} `;
    } else {
      // make the tables.
      // this is putting each card into a row/col bucket by using
      // the remainder value from the modulo function as a numbering system.
      const rowIndex = (i + 1) % cols;
      const pageIndex = (i + 1) % (rows * cols);
      const tdTag = `<td>${tag}</td>`;
      let tableTag = '';

      if (pageIndex == 1) {
        // first card on page
        tableTag += `<table>`;
      }
      if (rowIndex == 1) {
        // first card in row
        tableTag += `<tr>${tdTag}`;
      } else if (rowIndex == 0) {
        // last card in row
        tableTag += `${tdTag}</tr>`;
      } else {
        // middle card
        tableTag += `${tdTag}`;
      }
      if (pageIndex == 0) {
        // last card on page
        tableTag += '</table>';
      }
      fullTag += tableTag;
    }
  });
  return fullTag;
}
