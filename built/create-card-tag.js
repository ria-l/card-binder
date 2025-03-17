import * as binder from './binder-fn.js';
import * as constants from './constants.js';
import * as create from './create.js';
import * as get from './get.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
export async function createCardImgForBinder(card, borderColors, title, blobsObj, filePathsObj) {
    const width = get.getCardSize();
    const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment
    const img = new Image(width, height);
    await getImgSrc(card, img, blobsObj, filePathsObj);
    img.title = title;
    img.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
    img.style.setProperty('border-radius', `${width / 20}px`);
    img.classList.add('card');
    // add borders if toggle is checked
    if (document.getElementById('toggle-borders').checked) {
        img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
        img.style.setProperty('border', `${width / 15}px solid transparent`);
    }
    img.onclick = function () {
        ui.zoomCardInBinder(img);
    };
    return img;
}
export async function getImgSrc(card, img, blobsObj, filePathsObj) {
    utils.toggleStatusModal(card.id, 'showstatus');
    const url = new URL(card.zRaw.images.large);
    const path = url.pathname.substring(1); // 'xy0/2_hires.png'
    const blobStored = await blobInStorage(card, blobsObj);
    const pathStored = await isPathInStorage(card.zRaw.images.large, filePathsObj);
    // in file system
    if (pathStored) {
        img.src = `img/${path}`;
    }
    // in indexdb
    else if (blobStored) {
        img.src = blobStored;
    }
    // fetch and store
    else {
        const imgBlob = await tcg.fetchBlob(card.zRaw.images.large);
        const img64 = await utils.convertBlobToBase64(imgBlob);
        if (!img64) {
            throw new Error(`blob not converted: ${card.zRaw.images.large}`);
        }
        img.src = img64;
        await store.storeBlob(card, img64);
    }
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
export async function isPathInStorage(cardUrl, filePathsObj) {
    localbase.db.config.debug = false;
    if (!filePathsObj) {
        return false;
    }
    const key = utils.extractDirAndFilenameWithoutExt(cardUrl);
    console.log('cardurl', cardUrl);
    const cardPathBlob = await localbase.db
        .collection(constants.STORAGE_KEYS.filePaths)
        .doc(key)
        .get();
    return cardPathBlob;
}
//# sourceMappingURL=create-card-tag.js.map