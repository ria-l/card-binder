import * as constants from './constants.js';

export function fillPage() {
  constants.initialize();
  const binderContent = createPageContent();
  document.getElementById('contentDiv').innerHTML = '';
  binderContent.forEach((item) => {
    document.getElementById('contentDiv').appendChild(item);
  });
}

function createPageContent() {
  const cardTags = createCardTags();
  const rows = parseInt(document.getElementById('rowDropdown').selectedIndex);
  const cols = parseInt(document.getElementById('colDropdown').selectedIndex);
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

function createCardTags() {
  const data = getBinderOrSetData();
  const cardSize = document.getElementById('sizeDropdown').value;
  const tags = [];
  for (var card = 0; card < data.length; card++) {
    const dir = `img/${data[card][constants.SET_COL].toLowerCase()}`;
    const filename = data[card][constants.FILENAME_COL];
    const pkmntype = data[card][constants.PKMNTYPE_COL];
    const cardtype = data[card][constants.CARDTYPE_COL];
    const visuals = data[card][constants.VISUALS_COL];
    const dex = data[card][constants.DEX_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype} : ${visuals} : ${dex}`;
    if (data[card][constants.CAUGHT_COL] == 'x') {
      generateImgTag(tags, dir, filename, title, cardSize);
    } else {
      generatePlaceholder(card, cardtype, visuals, cardSize, tags, title);
    }
  }
  return tags;
}

function generateImgTag(tags, dir, filename, title, cardSize) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');
  tags.push(img);
}

function generatePlaceholder(i, cardtype, visuals, cardSize, tags, title) {
  // note that there are a couple other styles in the css file

  const border_colors = generateBorderColors(i, cardtype);
  let fill_colors;
  if (visuals.includes('gold')) {
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

export function generateBorderColors(picked_card_row, cardtype) {
  let special;
  const data = getBinderOrSetData();
  if (cardtype != 'basic') {
    special = constants.CARD_HEX_COLORS[cardtype].join(',');
  }
  let border_colors;
  const light =
    constants.PKMN_HEX_COLORS[data[picked_card_row][constants.PKMNTYPE_COL]][0];
  const dark =
    constants.PKMN_HEX_COLORS[data[picked_card_row][constants.PKMNTYPE_COL]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }
  return border_colors;
}

export function getBinderOrSetData() {
  let data;
  const binderName = localStorage.getItem('bindername');
  const setName = localStorage.getItem('setname');
  const binderOrSet = localStorage.getItem('binder_or_set');
  if (!binderOrSet || binderOrSet === 'binder') {
    data = JSON.parse(localStorage.getItem(binderName));
  } else if (binderOrSet === 'set') {
    data = JSON.parse(localStorage.getItem(setName));
  }
  return data;
}
