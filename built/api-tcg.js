import * as constants from './constants.js';
import * as get from './get.js';
import * as store from './store.js';
import * as types from './types.js';
import * as utils from './utils.js';
export async function fetchAndStoreSetMetadata(forceSync = false) {
    const storedData = await get.getSetMetadata();
    if (storedData && !forceSync) {
        return;
    }
    const data = await fetchJson('https://api.pokemontcg.io/v2/sets');
    store.storeSetMetaData(data);
}
export async function fetchJson(url) {
    const apiKey = await get.getSecret(constants.SECRETS_KEYS.tcgapiKey);
    try {
        console.log(`Fetching ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error(error);
    }
}
export async function fetchCardsForSet(setId) {
    const data = await fetchJson(`${constants.CARDS_SETID_URL}${setId}`);
    return data;
}
//# sourceMappingURL=api-tcg.js.map