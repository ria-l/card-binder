import * as constants from './v2-constants.js';
import * as utils from './v2-utils.js';
/**
 * sets random background image
 */
export function setBg() {
    const bgSpan = utils.getElByIdOrThrow('bg-span');
    const x = Math.floor(Math.random() * constants.BG_FILES.length);
    bgSpan.style.setProperty('background-image', `url('img/0_bg/${constants.BG_FILES[x]}')`);
}
//# sourceMappingURL=v2-ui.js.map