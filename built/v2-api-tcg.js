import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as store from './v2-store.js';
import * as types from './v2-types.js';
import * as utils from './v2-utils.js';
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
export async function fetchBlob(url) {
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
        return response.blob();
    }
    catch (error) {
        console.error(error);
    }
}
//# sourceMappingURL=v2-api-tcg.js.map