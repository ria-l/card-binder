import * as constants from './constants.js';

export function fillPage() {
  const data = getDataToDisplay();
  const cardTags = createCardTags(data);
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

function createCardTags(data) {
  const cardSize = document.getElementById('sizeDropdown').value;
  const tags = [];
  const header = JSON.parse(localStorage.getItem('header') ?? '[]');
  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const set = constants
      .getMetadatum('set', data[rowNum], header)
      .toLowerCase();
    const dir = `img/${set}`;
    const filename = constants.getMetadatum('filename', data[rowNum], header);
    const energytype = constants.getMetadatum(
      'energytype',
      data[rowNum],
      header
    );
    const cardtype = constants.getMetadatum('cardtype', data[rowNum], header);
    const visuals = constants.getMetadatum('visuals', data[rowNum], header);
    const caught = constants.getMetadatum('caught', data[rowNum], header);
    const title = `${filename} : ${energytype} : ${cardtype} : ${visuals}`;
    if (caught == 'x') {
      tags.push(
        generateImgTag(dir, filename, title, cardSize, cardtype, energytype)
      );
    } else {
      const borderColors = generateBorderColors(cardtype, energytype);
      const fillColors = constants.FILL_COLORS(visuals, energytype);
      tags.push(generatePlaceholder(cardSize, title, borderColors, fillColors));
    }
  }
  return tags;
}

function generateImgTag(dir, filename, title, cardSize, cardtype, energytype) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');
  img.setAttribute('card-type', cardtype);
  img.setAttribute('energy-type', energytype);
  if (document.getElementById('toggle-borders').checked) {
    const borderColors = generateBorderColors(cardtype, energytype);
    img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
    img.style.setProperty('border', `${cardSize / 15}px solid transparent`);
  }
  img.onclick = function () {
    displayZoom(dir, filename);
  };
  return img;
}

function displayZoom(dir, filename) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  const zoomSpan = document.getElementById('zoom-span');
  img.onclick = function () {
    // close zoomed card
    zoomSpan.innerHTML = '';
  };
  // clear any already zoomed cards
  if (zoomSpan.innerHTML) {
    zoomSpan.innerHTML = '';
  }
  img.className = 'zoomed-card';
  zoomSpan.appendChild(img);
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

export function generateBorderColors(cardtype, energytype) {
  const energyColors = constants.ENERGY_COLORS[energytype];
  const cardColors = constants.CARD_COLORS[cardtype];
  if (cardtype == 'basic') {
    return `${energyColors},${energyColors},${energyColors[1]}`;
  } else if (cardtype != 'basic') {
    return `${energyColors},white,${cardColors}`;
  }
}

export function getDataToDisplay() {
  const binderName = localStorage.getItem('bindername');
  const setName = localStorage.getItem('setname');
  const container = localStorage.getItem('container');
  if (!container || container === 'binder') {
    return JSON.parse(localStorage.getItem(binderName));
  } else if (container === 'set') {
    return JSON.parse(localStorage.getItem(setName));
  }
}
