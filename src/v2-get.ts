import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-fetch-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
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

export async function getCardsForSet(): Promise<{
  setId: string;
  cards: types.Card[];
}> {
  const setId = utils.getLsDataOrThrow(constants.STORAGE_KEYS.activeSet);
  let setData = await get.getSetMetadata();
  let cards: types.Card[] = setData[setId]['cards'];
  if (!cards || !Object.keys(cards).length) {
    cards = await tcg.fetchAndStoreCardsBySet(setId);
  }
  return { setId, cards };
}

export function getSubtype(card: types.tcgCard) {
  const subtypes = card.subtypes ?? ['none'];
  let subtype = '';
  for (let type of subtypes) {
    if (type.toLowerCase() in constants.POKEMON_COLORS) {
      subtype = type;
    }
  }
  return subtype;
}

export function getEnergyType(card: types.tcgCard) {
  const energy = card.types ?? '';
  if (energy && energy[0]) {
    return energy[0];
  } else {
    return '';
  }
}

export function getGSheet(sheet: string): string[][] {
  const data = utils.getLsDataOrThrow(constants.STORAGE_KEYS.rawSheetsData);
  return data.valueRanges.find((item: any) => item.range.includes(sheet))
    .values;
}
