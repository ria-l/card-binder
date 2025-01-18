import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as store from './v2-store.js';
import * as tcg from './v2-fetch-tcg.js';
import * as utils from './v2-utils.js';

export function getTcgApiKey(): string {
  const secrets = localStorage.getItem(constants.STORAGE_KEYS.secrets); // don't use throw
  if (secrets) {
    const apiKey = JSON.parse(secrets).PKMN_API_KEY;
    if (apiKey) {
      return apiKey;
    }
  }
  return ''; // not worth getting it if it's missing
}

/**
 * gets from storage, or fetches from source if missing
 */
export async function getSetMetadata() {
  let setMetadata = localStorage.getItem(constants.STORAGE_KEYS.setMetadata); // dont use throw
  if (setMetadata) {
    return JSON.parse(setMetadata);
  } else {
    const data = await tcg.fetchJson('https://api.pokemontcg.io/v2/sets');
    return store.storeSetMetaData(data);
  }
}
/**
 * Gets one of the following in preferential order: stored active set, selected set, random set.
 * We want the stored value first to preserve selection across pages/sessions.
 * @returns
 */
export async function getActiveSet(): Promise<string> {
  let activeSet = localStorage.getItem(constants.STORAGE_KEYS.activeSet);
  if (!activeSet) {
    activeSet = getSelectedSet();
  }
  return activeSet ?? (await utils.pickRandomSet());
}

export function getSelectedSet(): string {
  const setDropdown = utils.getElByIdOrThrow(
    'set-dropdown'
  ) as HTMLSelectElement;
  const selectedSet = setDropdown.options[setDropdown.selectedIndex];
  if (selectedSet) {
    return selectedSet.value;
  }
  return '';
}

export async function getCardsForSet() {
  const setId = utils.getLsDataOrThrow(constants.STORAGE_KEYS.activeSet);
  let setData = await get.getSetMetadata();
  let cards: string[] = setData[setId]['cards'];
  if (!cards || !cards.length) {
    cards = await tcg.fetchAndStoreCardsBySet(setId);
  }
  return { setId, cards };
}
