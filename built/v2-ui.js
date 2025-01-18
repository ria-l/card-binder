import * as constants from './v2-constants.js';
import * as utils from './v2-utils.js';
import { getActiveSet, getSetMetadata } from './v2-get.js';
export function setRandomBg() {
    const bgSpan = utils.getElByIdOrThrow('bg-span');
    const x = Math.floor(Math.random() * constants.BG_FILES.length);
    bgSpan.style.setProperty('background-image', `url('img/0_bg/${constants.BG_FILES[x]}')`);
}
export async function fillSetDropdown() {
    const setMetadata = await getSetMetadata();
    const activeSet = await getActiveSet();
    const setDropdown = utils.getElByIdOrThrow('set-dropdown');
    if (setDropdown)
        setDropdown.innerHTML = '';
    for (let setId of Object.keys(setMetadata)) {
        const option = document.createElement('option');
        option.value = setId;
        option.textContent = setMetadata[setId]['name'];
        if (setId == activeSet) {
            option.selected = true;
        }
        setDropdown.appendChild(option);
    }
}
/**
 * generates hex string for gradient border
 * @param cardtype v, vmax, ex, etc
 * @param energytype grass, water, etc
 * @returns
 */
export function generateBorderColors(cardtype, energytype) {
    if (!(cardtype in constants.MY_SUBTYPES)) {
        cardtype = 'missing';
    }
    const energyColors = constants.ENERGY_COLORS[energytype];
    const cardColors = constants.CARD_COLORS[cardtype];
    if (cardtype == 'basic') {
        return `${energyColors},${energyColors},${energyColors[1]}`;
    }
    else {
        return `${energyColors},white,${cardColors}`;
    }
}
//# sourceMappingURL=v2-ui.js.map