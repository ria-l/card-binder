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
//# sourceMappingURL=v2-ui.js.map