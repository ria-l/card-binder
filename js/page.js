import * as constants from './constants.js';

export function fillPage() {
  constants.initializeConsts();
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
    const caught = data[card][constants.CAUGHT_COL];
    const title = `${filename} : ${pkmntype} : ${cardtype} : ${visuals} : ${dex}`;
    if (caught == 'x') {
      tags.push(generateImgTag(dir, filename, title, cardSize));
    } else {
      const borderColors = generateBorderColors(cardtype, pkmntype);
      const fillColors = constants.FILL_COLORS(visuals, pkmntype);
      tags.push(generatePlaceholder(cardSize, title, borderColors, fillColors));
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

function generatePlaceholder(cardSize, title, borderColors, fillColors) {
  // note that there are a couple other styles in the css file
  const ph = document.createElement('span');
  ph.className = 'placeholder';
  ph.title = title;
  ph.style.width = `${cardSize}px`;
  ph.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  ph.style.background = `linear-gradient(to bottom right, ${fillColors}) padding-box, linear-gradient(to bottom right, ${borderColors}) border-box`;
  ph.style.borderRadius = `${cardSize / 20}px`;
  ph.style.border = `${cardSize / 15}px solid transparent`;
  return ph;
}

export function generateBorderColors(cardtype, pkmntype) {
  const pkmnColors = constants.PKMN_COLORS[pkmntype];
  const cardColors = constants.CARD_COLORS[cardtype];
  if (cardtype == 'basic') {
    return `${pkmnColors},${pkmnColors},${pkmnColors[1]}`;
  } else if (cardtype != 'basic') {
    return `${pkmnColors},white,${cardColors}`;
  }
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
