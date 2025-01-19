import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export function getElByIdOrThrow(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`No element ${elementId}`);
    }
    return element;
}
export function toggleStatusModal(message, showHide) {
    const statusSpan = document.getElementById('status-span');
    if (statusSpan) {
        statusSpan.innerHTML = message;
        statusSpan.className = showHide;
    }
}
export function getLsDataOrThrow(storageKey) {
    const data = localStorage.getItem(storageKey);
    if (!data) {
        throw new Error(`No ${storageKey} data found in local storage`);
    }
    try {
        JSON.parse(data);
    }
    catch (error) {
        // parse will throw an error if the data is a string
        return data;
    }
    return JSON.parse(data);
}
export async function pickRandomSet() {
    const setData = await get.getSetMetadata();
    const x = setData[Math.floor(Math.random() * setData.length)];
    return setData[x];
}
//# sourceMappingURL=v2-utils.js.map