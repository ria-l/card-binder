import * as constants from './constants.js';

/**
 * wrapper method that calls functions needed to fill page with cards and placeholders
 */
export function fillPage() {
  const data: string[][] = getDataToDisplay();
  const cardTags = createCardTags(data);
  const tables = createTables(cardTags);
  const contentDiv = document.getElementById('contentDiv');
  if (contentDiv) {
    contentDiv.innerHTML = '';
  }
  tables.forEach((table) => {
    document.getElementById('contentDiv')?.appendChild(table);
  });
}

/**
 *
 * @param cardTags generated img elements
 * @returns generated tables or cards (if no grid) to display
 */
function createTables(
  cardTags: HTMLImageElement[]
): HTMLTableElement[] | HTMLImageElement[] | Text[] {
  const numRows = (document.getElementById('rowDropdown') as HTMLSelectElement)
    .selectedIndex;
  const numCols = (document.getElementById('colDropdown') as HTMLSelectElement)
    .selectedIndex;
  const allTables: HTMLTableElement[] | HTMLImageElement[] | Text = [];
  let currentTable: HTMLTableElement;
  let currentRow: HTMLTableRowElement;

  cardTags.forEach((tag, i) => {
    if (!numRows || !numCols) {
      allTables.push(tag);
      const spaceNode = document.createTextNode(' ');
      allTables.push(spaceNode);
    } else {
      // Use the remainder value from the modulo function to put each card into a row/grid bucket.
      const rowIndex = (i + 1) % numCols;
      const gridIndex = (i + 1) % (numRows * numCols);
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
        if (numCols == 1) {
          currentRow = tr;
        }
        if (numRows == 1) {
          currentTable = table;
        }
        currentRow.appendChild(td);
        currentTable.appendChild(currentRow);
      } else {
        currentRow.appendChild(td);
      }
      // last card in grid
      if (gridIndex == 0) {
        if (numCols == 1) {
          currentRow = tr;
        }
        if (numRows == 1) {
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

/**
 *
 * @param data JSON sheet data
 * @returns img elements for owned cards in the data
 */
function createCardTags(data: string[][]): HTMLImageElement[] {
  const cardSize = parseInt(
    (document.getElementById('sizeDropdown') as HTMLSelectElement).value
  );
  const tags = [];
  const header = JSON.parse(localStorage.getItem('header') ?? '[]');

  for (const row of data) {
    const set = constants.getCellValue('set', row, header).toLowerCase();
    const dir = `img/${set}`;
    const filename = constants.getCellValue('filename', row, header);
    const energytype = constants.getCellValue('energytype', row, header);
    const cardtype = constants.getCellValue('cardtype', row, header);
    const visuals = constants.getCellValue('visuals', row, header);
    const caught = constants.getCellValue('caught', row, header);
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

/**
 * generates image elements
 * @param dir
 * @param filename
 * @param title
 * @param cardSize
 * @param cardtype
 * @param energytype
 * @returns
 */
function generateImgTag(
  dir: string,
  filename: string,
  title: string,
  cardSize: number,
  cardtype: string,
  energytype: string
): HTMLImageElement {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');
  img.setAttribute('card-type', cardtype);
  img.setAttribute('energy-type', energytype);
  if ((document.getElementById('toggle-borders') as HTMLInputElement).checked) {
    const borderColors = generateBorderColors(cardtype, energytype);
    img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
    img.style.setProperty('border', `${cardSize / 15}px solid transparent`);
  }
  img.onclick = function () {
    displayZoom(dir, filename);
  };
  return img;
}

/**
 * displays given card zoomed-in in the center of the screen
 * @param dir
 * @param filename
 */
function displayZoom(dir: string, filename: string) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  const zoomSpan = document.getElementById('zoom-span');
  if (zoomSpan) {
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
}

/**
 * generates placeholders for un-owned cards
 * @param cardSize
 * @param title
 * @param borderColors hex values
 * @param fillColors hex values
 * @returns
 */
function generatePlaceholder(
  cardSize: number,
  title: string,
  borderColors: string,
  fillColors: string
) {
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

/**
 * generates hex string for gradient border
 * @param cardtype v, vmax, ex, etc
 * @param energytype grass, water, etc
 * @returns
 */
export function generateBorderColors(
  cardtype: string,
  energytype: string
): string {
  const energyColors =
    constants.ENERGY_COLORS[energytype as keyof typeof constants.ENERGY_COLORS];
  const cardColors =
    constants.CARD_COLORS[cardtype as keyof typeof constants.CARD_COLORS];
  if (cardtype == 'basic') {
    return `${energyColors},${energyColors},${energyColors[1]}`;
  } else {
    return `${energyColors},white,${cardColors}`;
  }
}

/**
 * retrieve stored data for the active binder or set (also in storage)
 * @returns data for the given binder/set
 */
export function getDataToDisplay(): string[][] {
  const container = localStorage.getItem('container') ?? 'binder';
  const nameKey = container === 'binder' ? 'bindername' : 'setname';
  const name = localStorage.getItem(nameKey);

  if (!name) return [];

  return JSON.parse(localStorage.getItem(name) ?? '[]');
}
