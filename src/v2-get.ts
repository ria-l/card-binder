// get data, and fetch/store it if not found

import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

// this is in api-gapi-secrets.js
declare function getSecrets(): any;

export async function getSetMetadata() {
  let setMetadata = localStorage.getItem(constants.STORAGE_KEYS.setMetadata); // dont use throw

  if (!setMetadata) {
    const data = await tcg.fetchJson('https://api.pokemontcg.io/v2/sets');
    return store.storeSetMetaData(data);
  }

  return JSON.parse(setMetadata);
}
/**
 * Gets one of the following in preferential order: stored active set, selected set, random set.
 * We want the stored value first to preserve selection across pages/sessions.
 */
export async function getActiveSet(): Promise<string> {
  let activeSet = localStorage.getItem(constants.STORAGE_KEYS.activeSet);
  if (!activeSet) {
    activeSet = getSelectedSet();
  }
  return activeSet ?? (await pickAndStoreRandomSet());
}

async function pickAndStoreRandomSet(): Promise<string> {
  const setData = await getSetMetadata();
  const setIds = Object.keys(setData);

  const i = Math.floor(Math.random() * setIds.length);
  localStorage.setItem(constants.STORAGE_KEYS.activeSet, setIds[i] ?? 'base1');
  return setIds[i] ?? 'base1';
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

export async function getCardsForActiveSet(): Promise<types.Card[]> {
  const setId = await getActiveSet();
  let setData = await get.getSetMetadata();
  let cards: types.Card[] = setData[setId]['cards'];

  if (!cards || !Object.keys(cards).length) {
    cards = await tcg.fetchAndStoreCardsBySet(setId);
  }
  return cards;
}

export async function getSecret(key: string): Promise<string> {
  const secrets = utils.getLsDataOrThrow(constants.STORAGE_KEYS.secrets);
  if (!secrets) {
    const fetched = await getSecrets();
    return fetched[key];
  }
  return secrets[key];
}

// getvalues from api objects

/**
 * only returns subtypes that are used for color matching in constants, otherwise return empty string.
 * @param card 
 * @returns 
 */
export function getSubtype(card: types.tcgCard) {
  if (!card.subtypes) {
    return ''
  }
  let subtype = '';
  if (card.supertype === 'Pokémon') {
    for (let type of card.subtypes) {
      if (type.toLowerCase() in constants.POKEMON_COLORS) {
        subtype = type;
      }
    }
    return subtype.toLowerCase();
  }
  if (card.supertype === 'Trainer') {
    for (let type of card.subtypes) {
      if (type.toLowerCase() in constants.TRAINER_COLORS) {
        subtype = type;
      }
    }
    return subtype.toLowerCase();
  }
  if (card.supertype === 'Energy') {
    for (let type of card.subtypes) {
      if (type.toLowerCase() in constants.ENERGY_COLORS) {
        subtype = type;
      }
    }
    return subtype.toLowerCase();
  }
}

export function getEnergyType(card: types.tcgCard) {
  if (card.types && card.types.length && card.types[0]) {
    return card.types[0].toLowerCase();
  } else return '';
}

export function getDexNum(card: types.tcgCard) {
  if (
    card.nationalPokedexNumbers &&
    card.nationalPokedexNumbers.length &&
    card.nationalPokedexNumbers[0]
  ) {
    return card.nationalPokedexNumbers[0];
  } else return card.nationalPokedexNumbers;
}

export function getRarityType(card: types.Card) {
  let gradientKey: 'a_normal' | 'b_holo' | 'c_extra' | 'd_illust' | 'gold' =
    'a_normal';
  let rarity: string = card.rarity ?? 'promo';
  for (const key in constants.RARITY_MAP) {
    if (constants.RARITY_MAP.hasOwnProperty(key)) {
      if (
        constants.RARITY_MAP[key] &&
        constants.RARITY_MAP[key].some(
          (value) => value === rarity.toLowerCase()
        )
      ) {
        gradientKey = key as
          | 'a_normal'
          | 'b_holo'
          | 'c_extra'
          | 'd_illust'
          | 'gold';
      }
    }
  }
  return gradientKey;
}

export function getEnergyColors(card: types.Card) {
  let energy =
    card.energy.toLowerCase() in constants.ENERGY_COLORS
      ? card.energy.toLowerCase()
      : 'colorless';
  let energyColors = constants.ENERGY_COLORS[
    energy as keyof typeof constants.ENERGY_COLORS
  ] ?? ['#00FFFF', '#00FFFF'];
  return energyColors;
}