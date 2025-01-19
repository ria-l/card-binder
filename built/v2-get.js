import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export function getTcgApiKey() {
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
    }
    else {
        const data = await tcg.fetchJson('https://api.pokemontcg.io/v2/sets');
        return store.storeSetMetaData(data);
    }
}
/**
 * Gets one of the following in preferential order: stored active set, selected set, random set.
 * We want the stored value first to preserve selection across pages/sessions.
 * @returns
 */
export async function getActiveSet() {
    let activeSet = localStorage.getItem(constants.STORAGE_KEYS.activeSet);
    if (!activeSet) {
        activeSet = getSelectedSet();
    }
    return activeSet ?? (await pickAndStoreRandomSet());
}
async function pickAndStoreRandomSet() {
    const setData = await get.getSetMetadata();
    const setIds = Object.keys(setData);
    const i = Math.floor(Math.random() * setIds.length);
    localStorage.setItem(constants.STORAGE_KEYS.activeSet, setIds[i] ?? 'base1');
    return setIds[i] ?? 'base1';
}
export function getSelectedSet() {
    const setDropdown = utils.getElByIdOrThrow('set-dropdown');
    const selectedSet = setDropdown.options[setDropdown.selectedIndex];
    if (selectedSet) {
        return selectedSet.value;
    }
    return '';
}
export async function getCardsForSet() {
    const setId = utils.getLsDataOrThrow(constants.STORAGE_KEYS.activeSet);
    let setData = await get.getSetMetadata();
    let cards = setData[setId]['cards'];
    if (!cards || !Object.keys(cards).length) {
        cards = await tcg.fetchAndStoreCardsBySet(setId);
    }
    return { setId, cards };
}
export function getSubtype(card) {
    const subtypes = card.subtypes ?? ['none'];
    let subtype = '';
    if (card.supertype === 'Pokémon') {
        for (let type of subtypes) {
            if (type.toLowerCase() in constants.POKEMON_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
    if (card.supertype === 'Trainer') {
        for (let type of subtypes) {
            if (type.toLowerCase() in constants.TRAINER_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
    if (card.supertype === 'Energy') {
        for (let type of subtypes) {
            if (type.toLowerCase() in constants.ENERGY_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
}
export function getEnergyType(card) {
    if (card.types && card.types.length && card.types[0]) {
        return card.types[0].toLowerCase();
    }
    else
        return '';
}
export function getGSheet(sheet) {
    const data = utils.getLsDataOrThrow(constants.STORAGE_KEYS.rawSheetsData);
    return data.valueRanges.find((item) => item.range.includes(sheet))
        .values;
}
export function getSecret(key) {
    const secrets = utils.getLsDataOrThrow(constants.STORAGE_KEYS.secrets);
    return secrets[key];
}
export function getDexNum(card) {
    if (card.nationalPokedexNumbers &&
        card.nationalPokedexNumbers.length &&
        card.nationalPokedexNumbers[0]) {
        return card.nationalPokedexNumbers[0];
    }
    else
        return card.nationalPokedexNumbers;
}
//# sourceMappingURL=v2-get.js.map