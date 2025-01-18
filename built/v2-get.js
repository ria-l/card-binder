import * as constants from './v2-constants.js';
import * as tcg from './v2-fetch-tcg.js';
import * as store from './v2-store.js';
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
    return activeSet ?? (await utils.pickRandomSet());
}
export function getSelectedSet() {
    const setDropdown = utils.getElByIdOrThrow('set-dropdown');
    const selectedSet = setDropdown.options[setDropdown.selectedIndex];
    if (selectedSet) {
        return selectedSet.value;
    }
    return '';
}
//# sourceMappingURL=v2-get.js.map