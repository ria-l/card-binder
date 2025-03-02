import * as binder from './v2-binder-fn.js';
import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export function setRandomBg() {
    const bgSpan = utils.getElByIdOrThrow('bg-span');
    const x = Math.floor(Math.random() * constants.BG_FILES.length);
    bgSpan.style.setProperty('background-image', `url('img/0_bg/${constants.BG_FILES[x]}')`);
}
export async function fillSetDropdown() {
    console.log('== fillSetDropdown ==');
    const setMetadata = await get.getSetMetadata();
    const activeSet = await get.getActiveSet();
    const setDropdown = utils.getElByIdOrThrow('set-dropdown');
    if (setDropdown)
        setDropdown.innerHTML = '';
    for (let setId of setMetadata) {
        const option = document.createElement('option');
        option.value = setId.id;
        option.textContent = setId.name;
        if (setId.id == activeSet) {
            option.selected = true;
        }
        setDropdown.appendChild(option);
    }
}
export function clearDisplay() {
    const largeCardSpan = document.getElementById('large-card-span');
    const smallCardSpan = document.getElementById('small-card-span');
    const listSpan = document.getElementById('list-span');
    if (largeCardSpan)
        largeCardSpan.innerHTML = '';
    if (smallCardSpan)
        smallCardSpan.innerHTML = '';
    const ol = document.createElement('ol');
    ol.id = 'card-list';
    ol.reversed = true;
    if (listSpan) {
        listSpan.innerHTML = '';
        listSpan.appendChild(ol);
    }
}
/**
 * generates hex string for gradient border
 * @param subtype basic, ex etc
 * @param energy
 * @param supertype pokemon, trainer, or energy
 * @returns
 */
export function generateBorderColors(subtype, energy, supertype) {
    supertype =
        supertype.toLowerCase() in constants.SUPERTYPE_COLORS
            ? supertype.toLowerCase()
            : 'trainer';
    // generate gradients
    if (supertype === 'pokémon') {
        subtype =
            subtype.toLowerCase() in constants.POKEMON_COLORS
                ? subtype.toLowerCase()
                : 'basic';
        const left = _getColors(constants.ENERGY_COLORS, energy);
        const right = _getColors(constants.POKEMON_COLORS, subtype);
        return subtype == 'basic'
            ? _createGradient(left, left, left[1])
            : _createGradient(left, 'white', right);
    }
    if (supertype === 'trainer') {
        subtype =
            subtype.toLowerCase() in constants.TRAINER_COLORS
                ? subtype.toLowerCase()
                : 'item';
        const left = _getColors(constants.TRAINER_COLORS, subtype);
        const right = _getColors(constants.SUPERTYPE_COLORS, supertype);
        return _createGradient(left, 'white', right);
    }
    if (supertype === 'energy') {
        energy =
            energy.toLowerCase() in constants.ENERGY_COLORS
                ? energy.toLowerCase()
                : 'colorless';
        const left = _getColors(constants.ENERGY_COLORS, energy);
        const right = _getColors(constants.SUPERTYPE_COLORS, supertype);
        return _createGradient(left, 'white', right);
    }
    throw new Error('no supertype for card');
    // helper functions
    function _getColors(colorMap, key) {
        return colorMap[key] ?? ['#00FF00', '#00FF00'];
    }
    function _createGradient(left, middle, right) {
        return `${left},${middle},${right}`;
    }
}
/**
 * displays given card zoomed-in in the center of the screen
 * @param dir
 * @param filename
 */
export function zoomCardInBinder(img) {
    const zImg = img.cloneNode(true);
    const zoomSpan = document.getElementById('zoom-span');
    if (zoomSpan) {
        zImg.onclick = function () {
            // close zoomed card
            zoomSpan.innerHTML = '';
        };
        // clear any already zoomed cards
        if (zoomSpan.innerHTML) {
            zoomSpan.innerHTML = '';
        }
        zImg.className = 'zoomed-card';
        zoomSpan.appendChild(zImg);
    }
}
export function updateGrid() {
    localStorage.setItem('grid_row', utils.getElByIdOrThrow('row-dropdown').selectedIndex.toString());
    localStorage.setItem('grid_col', utils.getElByIdOrThrow('col-dropdown').selectedIndex.toString());
    binder.fillPage();
}
export function resizeCards() {
    const cardSize = get.getCardSize();
    for (const card of document.getElementsByClassName('card')) {
        card.style.setProperty('width', `${cardSize}px`);
        card.style.setProperty('height', `${cardSize * 1.4}px`);
        card.style.setProperty('border-radius', `${cardSize / 20}px`);
    }
    for (const ph of document.getElementsByClassName('placeholder')) {
        ph.style.setProperty('width', `${cardSize}px`);
        ph.style.setProperty('height', `${cardSize * 1.4}px`);
        ph.style.setProperty('border-radius', `${cardSize / 20}px`);
        ph.style.setProperty('border', `${cardSize / 15}px solid transparent`);
        ph.style.setProperty('font-size', `${cardSize / 10}px`);
    }
}
export function addShowHideToggle(btnId, dropdownId) {
    utils.getElByIdOrThrow(btnId).addEventListener('click', function () {
        const containers = document.getElementsByClassName('dropdown-container');
        for (let el of containers) {
            if (el.classList.contains('show') && el.id != dropdownId) {
                el.classList.toggle('show');
            }
        }
        utils.getElByIdOrThrow(dropdownId).classList.toggle('show');
    });
}
//# sourceMappingURL=v2-ui.js.map