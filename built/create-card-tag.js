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
import * as gh from './api-github.js';
import * as utils from './utils.js';
export async function createCardImgForBinder(card, borderColors, title, filePathsObj) {
    const width = get.getCardSize();
    const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment
    const img = new Image(width, height);
    await getImgSrc(card, img, filePathsObj);
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
export async function getImgSrc(cardObj, img, filePathsObj) {
    utils.toggleStatusModal(cardObj.id, 'showstatus');
    const url = new URL(cardObj.zRaw.images.large);
    const path = url.pathname.substring(1); // 'xy0/2_hires.png'
    const pathStored = await isPathInStorage(cardObj.zRaw.images.large, filePathsObj);
    if (pathStored) {
        img.src = `img/${path}`;
    }
    else {
        img.src = cardObj.zRaw.images.large;
    }
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