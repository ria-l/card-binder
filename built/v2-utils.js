import * as binder from './v2-binder-fn.js';
import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as gh from './v2-api-github.js';
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
    localbase.db.config.debug = false;
    try {
        result = await localbase.db
            .collection(constants.STORAGE_KEYS.owned)
            .doc({ card_id: card.id })
            .get();
    }
    finally {
        return result ? true : false;
    }
}
export async function changeSet() {
    const activeSet = store.saveActiveSet();
    store.storeCardsBySetId(activeSet);
    binder.refreshBinder();
}
export async function pathInStorage(cardUrl, filePathsObj) {
    localbase.db.config.debug = false;
    if (!filePathsObj) {
        return false;
    }
    const key = extractFilenameWithoutExtension(cardUrl);
    const cardPathBlob = await localbase.db
        .collection(constants.STORAGE_KEYS.filePaths)
        .doc(key)
        .get();
    return cardPathBlob ? true : false;
}
export async function blobInStorage(card, blobsObj) {
    if (!blobsObj) {
        return undefined;
    }
    const blobsByCardId = new Map(blobsObj.map((obj) => [
        obj.card_id,
        obj,
    ]));
    const result = blobsByCardId.get(card.id);
    return result ? blobsByCardId.get(card.id).blob64 : undefined;
}
/**
 * gets just the file name without the extension
 */
export function extractFilenameWithoutExtension(path) {
    const filename = path.split('/').pop() ?? path;
    // Remove the file extension using a regular expression
    const filenameWithoutExtension = filename.replace(/\.[^.]+$/, '');
    return filenameWithoutExtension;
}
//# sourceMappingURL=v2-utils.js.map