import * as binder from './binder-fn.js';
import * as constants from './constants.js';
import * as get from './get.js';
import * as gh from './api-github.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

export function getElByIdOrThrow(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`No element ${elementId}`);
  }
  return element;
}

export function toggleStatusModal(
  message: string,
  showHide: 'showstatus' | 'hide'
) {
  const statusSpan = document.getElementById('status-span');
  if (statusSpan) {
    statusSpan.innerHTML = message;
    statusSpan.className = showHide;
  }
}

export async function convertBlobToBase64(blob: Blob) {
  try {
    const base64String = await blobToBase64(blob);
    return base64String; // Optionally return the Base64 string
  } catch (error) {
    console.error('Error converting Blob to Base64:', error);
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string); // Resolve with Base64 string
    };

    reader.onerror = reject; // Reject if an error occurs
    reader.readAsDataURL(blob); // Start reading the Blob as a Data URL
  });
}

export async function isOwnedCard(card: types.Card): Promise<boolean> {
  let result;
  localbase.db.config.debug = false;
  try {
    result = await localbase.db
      .collection(constants.STORAGE_KEYS.owned)
      .doc({ card_id: card.id })
      .get();
  } finally {
    return result ? true : false;
  }
}

export async function changeSet(): Promise<void> {
  const activeSet = store.saveActiveSet();
  store.storeCardsBySetId(activeSet);
  binder.refreshBinder();
}

/**
 * gets just the file name without the extension
 */

export function extractDirAndFilenameWithoutExt(path: string) {
  const arr = path.split('/');
  const filename = arr.pop() ?? 'none.jpg';
  const dir = arr.pop() ?? 'none';

  // Remove the file extension using a regular expression
  const filenameWithoutExtension = filename.replace(/\.[^.]+$/, '');

  return `${dir}/${filenameWithoutExtension}`;
}
