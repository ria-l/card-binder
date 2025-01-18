import * as get from './v2-get.js';

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

export async function pickRandomSet(): Promise<string> {
  const setData = await get.getSetMetadata();
  const x = setData[Math.floor(Math.random() * setData.length)];
  return setData[x];
}