import * as binder from './v2-binder.js';
import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as localbase from './v2-localbase.js';
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
export async function convertBlobToBase64(blob) {
    try {
        const base64String = await blobToBase64(blob);
        return base64String; // Optionally return the Base64 string
    }
    catch (error) {
        console.error('Error converting Blob to Base64:', error);
    }
}
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result); // Resolve with Base64 string
        };
        reader.onerror = reject; // Reject if an error occurs
        reader.readAsDataURL(blob); // Start reading the Blob as a Data URL
    });
}
export async function isOwnedCard(card) {
    let result;
    try {
        result = await localbase.db
            .collection('db-owned')
            .doc({ card_id: card.id })
            .get();
    }
    finally {
    }
    return result ? true : false;
}
export async function changeSet() {
    const activeSet = store.saveActiveSet();
    store.storeCardsBySetId(activeSet);
    binder.refreshBinder();
}
//# sourceMappingURL=v2-utils.js.map