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

function createTables(cardElements) {
  const numRows = document.getElementById('rowDropdown').selectedIndex;
  const numCols = document.getElementById('colDropdown').selectedIndex;

  if (!numRows || !numCols) {
    // If no rows or columns, simply return the cards and spaces
    return cardElements
      .map((card) => [card, document.createTextNode(' ')])
      .flat();
  }

  const allTables = [];
  let currentTable;
  let currentRow;
  const numTableCells = numRows * numCols;
  const incompleteTableCards = cardElements.length % numTableCells;

  cardElements.forEach((card, i) => {
    const rowIndex = i % numCols; // 0 is first card, 1 is last
    const tableIndex = i % numTableCells; // 0 is first card, 1 is last

    // Create new table and row for the first card in a new table
    if (tableIndex === 0) {
      currentTable = document.createElement('table');
    }
    if (rowIndex === 0) {
      currentRow = document.createElement('tr');
    }

    const td = document.createElement('td');
    td.appendChild(card);
    currentRow.appendChild(td);

    // Handle the last card in a row or last card in cardElements
    if (rowIndex === numCols - 1 || i === cardElements.length - 1) {
      currentTable.appendChild(currentRow);
    }

    // Handle the last card in a table or last card in cardElements
    if (tableIndex === numTableCells - 1 || i === cardElements.length - 1) {
      allTables.push(currentTable);
    }

    // Handle the case for incomplete tables
    if (
      incompleteTableCards > 0 &&
      i >= cardElements.length - incompleteTableCards
    ) {
      if (currentRow) {
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
