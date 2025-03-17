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

export async function createCardImgForBinder(
  card: types.Card,
  borderColors: string,
  title: string,
  blobsObj: {
    card_id: string;
    blob64: string;
  }[],
  filePathsObj: types.GithubTree[]
): Promise<HTMLImageElement> {
  const width = get.getCardSize();
  const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment

  const img = new Image(width, height);
  await getImgSrcAndSyncWGh(card, img, blobsObj, filePathsObj);
  img.title = title;
  img.style.setProperty(
    'background',
    `linear-gradient(to bottom right, ${borderColors}) border-box`
  );
  img.style.setProperty('border-radius', `${width / 20}px`);
  img.classList.add('card');

  // add borders if toggle is checked
  if ((document.getElementById('toggle-borders') as HTMLInputElement).checked) {
    img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
    img.style.setProperty('border', `${width / 15}px solid transparent`);
  }
  img.onclick = function () {
    ui.zoomCardInBinder(img);
  };
  return img;
}

export async function getImgSrcAndSyncWGh(
  cardObj: types.Card,
  img: HTMLImageElement,
  blobsObj: {
    card_id: string;
    blob64: string;
  }[],
  filePathsObj: types.GithubTree[]
) {
  utils.toggleStatusModal(cardObj.id, 'showstatus');
  const url = new URL(cardObj.zRaw.images.large);
  const path = url.pathname.substring(1); // 'xy0/2_hires.png'

  const blobStored = await blobInStorage(cardObj, blobsObj);
  const pathStored = await isPathInStorage(
    cardObj.zRaw.images.large,
    filePathsObj
  );

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
    const imgBlob = await tcg.fetchBlob(cardObj.zRaw.images.large);
    const img64 = await utils.convertBlobToBase64(imgBlob);
    if (!img64) {
      throw new Error(`blob not converted: ${cardObj.zRaw.images.large}`);
    }
    img.src = img64;
    await store.storeBlob(cardObj, img64);
    await gh.uploadImg(img64, path);
  }
}

export async function blobInStorage(
  card: types.Card,
  blobsObj: {
    card_id: string;
    blob64: string;
  }[]
): Promise<string | undefined> {
  if (!blobsObj) {
    return undefined;
  }
  const blobsByCardId: any = new Map(
    blobsObj.map((obj: { card_id: string; blob64: string }) => [
      obj.card_id,
      obj,
    ])
  );

  const result = blobsByCardId.get(card.id);
  return result ? blobsByCardId.get(card.id).blob64 : undefined;
}

export async function isPathInStorage(
  cardUrl: string,
  filePathsObj: types.GithubTree[]
): Promise<boolean> {
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
