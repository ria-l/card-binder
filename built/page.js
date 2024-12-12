import * as constants from './constants.js';
/**
 * wrapper method that calls functions needed to fill page with cards and placeholders
 */
export function fillPage() {
    const data = getDataToDisplay();
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
 * Creates tables to display the card grid on the binder page.
 * @param cardElements generated img elements
 * @returns generated tables or cards (if no grid) to display
 */
function createTables(cardElements) {
    const numRows = document.getElementById('rowDropdown')
        .selectedIndex;
    const numCols = document.getElementById('colDropdown')
        .selectedIndex;
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
        if (incompleteTableCards > 0 &&
            i >= cardElements.length - incompleteTableCards) {
            if (currentRow) {
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
function createCardTags(data) {
    const cardSize = parseInt(document.getElementById('sizeDropdown').value);
    const tags = [];
    const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
    for (const row of data) {
        const set = constants.getCellValue('set', row, header).toLowerCase() || 'missing';
        const dir = `img/${set}`;
        const filename = constants.getCellValue('filename', row, header);
        const energytype = constants.getCellValue('energytype', row, header) || 'missing';
        const cardtype = constants.getCellValue('cardtype', row, header) || 'missing';
        const visuals = constants.getCellValue('visuals', row, header) || 'missing';
        const caught = constants.getCellValue('caught', row, header);
        const title = `${filename} : ${energytype} : ${cardtype} : ${visuals}`;
        if (caught == 'x') {
            tags.push(generateImgTag(dir, filename, title, cardSize, cardtype, energytype));
        }
        else {
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
/**
 * displays given card zoomed-in in the center of the screen
 * @param dir
 * @param filename
 */
function displayZoom(dir, filename) {
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
/**
 * generates hex string for gradient border
 * @param cardtype v, vmax, ex, etc
 * @param energytype grass, water, etc
 * @returns
 */
export function generateBorderColors(cardtype, energytype) {
    const energyColors = constants.ENERGY_COLORS[energytype];
    const cardColors = constants.CARD_COLORS[cardtype];
    if (cardtype == 'basic') {
        return `${energyColors},${energyColors},${energyColors[1]}`;
    }
    else {
        return `${energyColors},white,${cardColors}`;
    }
}
/**
 * retrieve stored data for the active binder or set (also in storage)
 * @returns data for the given collection
 */
export function getDataToDisplay() {
    const collectionType = localStorage.getItem('collection_type') ?? 'binder';
    const nameKey = collectionType === 'binder' ? 'active_binder' : 'active_set';
    const name = localStorage.getItem(nameKey); // TODO: refactor collection type vars
    if (!name)
        return [];
    return JSON.parse(localStorage.getItem(name) ?? '[]'); // TODO: refactor collection type vars
}
//# sourceMappingURL=page.js.map