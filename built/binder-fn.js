import * as constants from './constants.js';
import * as create from './create.js';
import * as get from './get.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
import * as crCard from './create-card-tag.js';
export async function fillPage() {
    console.log('== fillPage ==');
    utils.toggleStatusModal('loading binder...', 'showstatus');
    const cards = await create.createCardsForActiveSetInBinder();
    const contentDiv = utils.getElByIdOrThrow('content-div');
    contentDiv.innerHTML = '';
    const tables = createTables(cards);
    tables.forEach((table) => {
        contentDiv.appendChild(table);
    });
    utils.toggleStatusModal('', 'hide');
}
export function generateFillColors(card) {
    let energyColors = get.getEnergyColors(card);
    let rarityType = get.getRarityType(card);
    const fillColors = _fillColors(energyColors);
    return fillColors[rarityType];
}
/**
 * not in constants bc of dynamic colors
 */
function _fillColors(energyColors) {
    return {
        a_normal: `#f9f9f9,white,#f9f9f9,white,#f9f9f9`,
        b_holo: `${energyColors.join(',')},${energyColors[0]},white 30%,#f9f9f9,white,#f9f9f9`,
        c_extra: `${energyColors.join(',')},${energyColors[0]},white 75%,#f9f9f9,white,#f9f9f9`,
        d_illust: `${energyColors.join(',')},${energyColors.join(',')},${energyColors.join(',')}`,
        gold: '#fef081,#c69221,#fef081,#c69221,#fef081,#c69221',
    };
}
function createTables(cardImgs) {
    const numRows = get.getGridRow();
    const numCols = get.getGridCol();
    if (!numRows || !numCols) {
        // If no rows or columns, simply return the cards and spaces
        return cardImgs.map((card) => [card, document.createTextNode(' ')]).flat();
    }
    const allTables = [];
    let currentTable;
    let currentRow;
    const numTableCells = numRows * numCols;
    const incompleteTableCards = cardImgs.length % numTableCells;
    cardImgs.forEach((card, i) => {
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
        // Handle the last card in a row or last card in cardImgs
        if (rowIndex === numCols - 1 || i === cardImgs.length - 1) {
            currentTable.appendChild(currentRow);
        }
        // Handle the last card in a table or last card in cardImgs
        if (tableIndex === numTableCells - 1 || i === cardImgs.length - 1) {
            allTables.push(currentTable);
        }
        // Handle the case for incomplete tables
        if (incompleteTableCards > 0 &&
            i >= cardImgs.length - incompleteTableCards) {
            if (currentRow) {
                currentTable.appendChild(currentRow);
                allTables.push(currentTable);
            }
        }
    });
    return allTables;
}
export function refreshBinder() {
    const regex = new RegExp('binder');
    if (regex.test(location.pathname)) {
        fillPage();
    }
}
//# sourceMappingURL=binder-fn.js.map