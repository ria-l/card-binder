import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

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

export function getLsDataOrThrow(storageKey: string): any | null {
  const data = localStorage.getItem(storageKey);
  if (!data) {
    throw new Error(`No ${storageKey} data found in local storage`);
  }
  try {
    JSON.parse(data);
  } catch (error) {
    // parse will throw an error if the data is a string
    return data;
  }
  return JSON.parse(data);
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

export function isOwnedCard(card: types.Card): boolean {
  const owned = utils.getLsDataOrThrow('db-owned');
  if (owned.some((row: string[]) => row[0] === card.id)) {
    return true;
  }
  return false;
}
