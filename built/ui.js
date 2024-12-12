import * as constants from './constants.js';
import * as page from './page.js';
/**
 * sets background image randomly
 */
export function setBg() {
    const bgSpan = document.getElementById('bgSpan');
    const x = Math.floor(Math.random() * constants.BG_FILES.length);
    bgSpan?.style.setProperty('background-image', `url('img/0_bg/${constants.BG_FILES[x]}')`);
}
/**
 * wrapper to set initial grid and size values
 */
export function initializeGridAndSize() {
    const cardSize = initializeSizeValue();
    generateSizeDropdown(cardSize);
    let { gridCol, gridRow } = initializeGridValues();
    generateGridDropdown(gridCol, gridRow);
}
/**
 * gets stored grid values or sets defaults
 * @returns
 */
function initializeGridValues() {
    let gridCol = parseInt(localStorage.getItem('grid_col') ?? '0');
    let gridRow = parseInt(localStorage.getItem('grid_row') ?? '0');
    localStorage.setItem('grid_row', gridRow.toString());
    localStorage.setItem('grid_col', gridCol.toString());
    return { gridCol, gridRow };
}
/**
 * creates and displays grid dropdown elements
 * @param gridCol
 * @param gridRow
 */
function generateGridDropdown(gridCol, gridRow) {
    const colDropdown = document.getElementById('colDropdown');
    const rowDropdown = document.getElementById('rowDropdown');
    if (rowDropdown.options.length == 0) {
        for (let i = 0; i < 13; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            colDropdown.appendChild(option);
        }
        for (let i = 0; i < 13; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            rowDropdown.appendChild(option);
        }
    }
    // sets new values
    colDropdown.selectedIndex = gridCol;
    rowDropdown.selectedIndex = gridRow;
}
/**
 * saves new grid and refills page
 */
export function updateGrid() {
    localStorage.setItem('grid_row', document.getElementById('rowDropdown').selectedIndex.toString());
    localStorage.setItem('grid_col', document.getElementById('colDropdown').selectedIndex.toString());
    page.fillPage();
}
/**
 * gets stored card size value or sets default
 * @returns
 */
function initializeSizeValue() {
    let cardSize = parseInt(localStorage.getItem('card_size') ?? '120');
    // set the dropdown value to the specified size.
    localStorage.setItem('card_size', cardSize.toString());
    return cardSize;
}
/**
 * creates and displays card size dropdown
 * @param cardSize
 */
export function generateSizeDropdown(cardSize) {
    const sizeDropdown = document.getElementById('sizeDropdown');
    if (sizeDropdown.options.length == 0) {
        const sizeDropdown = document.getElementById('sizeDropdown');
        for (let i = 1; i < 11; i++) {
            const option = document.createElement('option');
            option.value = (i * 50).toString();
            option.textContent = (i * 50).toString();
            sizeDropdown?.appendChild(option);
        }
        for (let i = 1; i < 20; i++) {
            const option = document.createElement('option');
            option.value = (i * 10).toString();
            option.textContent = (i * 10).toString();
            sizeDropdown?.appendChild(option);
        }
    }
    // sets value
    const option = Array.from(sizeDropdown.options).find((option) => option.value === cardSize.toString());
    if (option) {
        option.selected = true;
    }
}
/**
 * saves new size and resizes cards and placeholders
 */
export function resizeCards() {
    const cardSize = parseInt(document.getElementById('sizeDropdown').value);
    localStorage.setItem('card_size', cardSize.toString());
    for (const card of document.getElementsByClassName('card')) {
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize * 1.4}px`;
        card.style.borderRadius = `${cardSize / 20}px`;
    }
    for (const ph of document.getElementsByClassName('placeholder')) {
        ph.style.width = `${cardSize}px`;
        ph.style.height = `${cardSize * 1.4}px`;
        ph.style.borderRadius = `${cardSize / 20}px`;
        ph.style.border = `${cardSize / 15}px solid transparent`;
    }
}
/**
 * creates and displays binder dropdown
 */
export function generateBinderDropdown() {
    const binderDropdown = document.getElementById('binderDropdown');
    const bindernames = JSON.parse(localStorage.getItem('bindernames') ?? '[]');
    const defaultbinder = localStorage.getItem('bindername');
    if (binderDropdown)
        binderDropdown.innerHTML = '';
    for (let binder of bindernames) {
        const option = document.createElement('option');
        option.value = binder;
        option.textContent = binder;
        if (binder == defaultbinder) {
            option.selected = true;
        }
        binderDropdown?.appendChild(option);
    }
}
/**
 * creates and displays set dropdown
 */
export function generateSetDropdown() {
    const setDropdown = document.getElementById('setDropdown');
    const setnames = JSON.parse(localStorage.getItem('setnames') ?? '[]');
    const defaultset = localStorage.getItem('setname');
    if (setDropdown)
        setDropdown.innerHTML = '';
    for (let set of setnames) {
        const option = document.createElement('option');
        if (set != 'set') {
            option.value = set;
            option.textContent = set;
        }
        if (set == defaultset) {
            option.selected = true;
        }
        setDropdown?.appendChild(option);
    }
}
/**
 * creates and displays progress bar for current binder/set
 */
export function createProgressBar() {
    const span = document.getElementById('progressSpan');
    const newBar = document.createElement('progress');
    const max = page.getDataToDisplay().length;
    const numPulled = countPulled();
    const ratio = document.createTextNode(`${numPulled}/${max} `);
    const percent = document.createTextNode(` ${((numPulled / max) * 100).toFixed(2)}%`);
    const newSpan = document.createElement('span');
    newBar.max = max;
    newBar.value = numPulled;
    newSpan.id = 'progressSpan';
    newSpan.appendChild(ratio);
    newSpan.appendChild(newBar);
    newSpan.appendChild(percent);
    span?.replaceWith(newSpan);
}
/**
 * counts number of owned cards in the current binder/set
 * @returns
 */
function countPulled() {
    const data = page.getDataToDisplay();
    const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
    const filtered = data.filter((row) => row[header.indexOf('caught')] == 'x');
    return filtered.length;
}
/**
 * updates storage to newly selected binder, fills page if needed, and creates progress bar
 * TODO: refactor
 * TODO: make this boolean
 * @param fillpage whether the function is being called to fill the page or not
 */
export function selectNewBinder(fillpage) {
    localStorage.setItem('container', 'binder');
    const binderDropdown = document.getElementById('binderDropdown');
    const bindername = binderDropdown.options[binderDropdown.selectedIndex]?.text ?? '';
    localStorage.setItem('bindername', bindername);
    highlightBinder();
    if (fillpage) {
        page.fillPage();
    }
    createProgressBar();
}
/**
 * updates storage to newly selected binder, fills page if needed, and creates progress bar
 * TODO: refactor
 * TODO: make this boolean
 * @param fillpage whether the function is being called to fill the page or not
 */
export function selectNewSet(fillpage) {
    localStorage.setItem('container', 'set');
    const setDropdown = document.getElementById('setDropdown');
    const setname = setDropdown.options[setDropdown.selectedIndex]?.text ?? '';
    localStorage.setItem('setname', setname);
    highlightSet();
    if (fillpage) {
        page.fillPage();
    }
    createProgressBar();
}
/**
 * highlights or unhighlights binder dropdown based on what was selected
 * TODO: refactor
 */
export function highlightBinder() {
    const binderDrop = document.getElementById('binderDropdown');
    binderDrop?.classList.add('highlight');
    const setDrop = document.getElementById('setDropdown');
    setDrop?.classList.remove('highlight');
}
/**
 * highlights or unhighlights set dropdown based on what was selected
 * TODO: refactor
 */
export function highlightSet() {
    const setDrop = document.getElementById('setDropdown');
    setDrop?.classList.add('highlight');
    const binderDrop = document.getElementById('binderDropdown');
    binderDrop?.classList.remove('highlight');
}
/**
 * adds event listener that shows or hides navbar dropdowns based on what was clicked
 * TODO: this is a mess
 * @param btnId the clicked button
 * @param dropdownId the dropdown to show
 */
export function addShowHideToggle(btnId, dropdownId) {
    document.getElementById(btnId)?.addEventListener('click', function () {
        const arr = document.getElementsByClassName('dropdown-container');
        for (let item of arr) {
            if (item.classList.contains('show') && item.id != dropdownId) {
                item.classList.toggle('show');
            }
        }
        document.getElementById(dropdownId)?.classList.toggle('show');
    });
}
/**
 * adds or removes borders in binder view based on checkbox
 */
export function toggleBorders() {
    const addBorders = document.getElementById('toggle-borders').checked;
    const cards = document.getElementsByClassName('card');
    const cardSize = parseInt(document.getElementById('sizeDropdown').value);
    for (const card of cards) {
        const energytype = card.getAttribute('energy-type');
        const cardtype = card.getAttribute('card-type');
        if (addBorders && cardtype && energytype) {
            const borderColors = page.generateBorderColors(cardtype, energytype);
            card.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
            card.style.setProperty('border', `${cardSize / 20}px solid transparent`);
        }
        else {
            card.style.removeProperty('background');
            card.style.removeProperty('border');
        }
    }
}
//# sourceMappingURL=ui.js.map