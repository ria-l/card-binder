import * as constants from './constants.js';

export function fillPage() {
  constants.initialize();
  const cardTags = createCardTags();
  const tables = createTables(cardTags);
  document.getElementById('contentDiv').innerHTML = '';
  tables.forEach((table) => {
    document.getElementById('contentDiv').appendChild(table);
  });
}

function createTables(cardTags) {
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
  const data = getDataToDisplay();
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
      const img = generateImgTag(dir, filename, title, cardSize);
      tags.push(img);
    } else {
      const span = generatePlaceholder(
        cardtype,
        visuals,
        cardSize,
        title,
        pkmntype
      );
      tags.push(span);
    }
  }
  return tags;
}

function generateImgTag(dir, filename, title, cardSize) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');
  return img;
}

function generatePlaceholder(cardtype, visuals, cardSize, title, pkmntype) {
  // note that there are a couple other styles in the css file
  const border_colors = generateBorderColors(cardtype, pkmntype);
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
  return span;
}

export function generateBorderColors(cardtype, pkmntype) {
  let special;
  if (cardtype != 'basic') {
    special = constants.CARD_HEX_COLORS[cardtype].join(',');
  }
  let border_colors;
  const light = constants.PKMN_HEX_COLORS[pkmntype][0];
  const dark = constants.PKMN_HEX_COLORS[pkmntype][1];
  if (cardtype != 'basic') {
    border_colors = `${dark},${light},white,${special}`;
  } else if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  }
  return border_colors;
}

export function getDataToDisplay() {
  let data;
  const binderName = localStorage.getItem('bindername');
  const setName = localStorage.getItem('setname');
  const container = localStorage.getItem('container');
  if (!container || container === 'binder') {
    data = JSON.parse(localStorage.getItem(binderName));
  } else if (container === 'set') {
    data = JSON.parse(localStorage.getItem(setName));
  }
  return data;
}
