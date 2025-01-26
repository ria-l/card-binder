import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as store from './v2-store.js';
import * as types from './v2-types.js';
import * as utils from './v2-utils.js';

export async function fetchAndStoreSetMetadata(forceSync: boolean = false) {
  const storedData = await get.getSetMetadata();
  if (storedData && !forceSync) {
    return;
  }
  const data = await fetchJson('https://api.pokemontcg.io/v2/sets');
  store.storeSetMetaData(data);
}

export async function fetchJson(url: string): Promise<any> {
  const apiKey = await get.getSecret(constants.SECRETS_KEYS.tcgapiKey);

  try {
    utils.toggleStatusModal(`Fetching ${url}`, 'showstatus');

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

    utils.toggleStatusModal('', 'hide');

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchCardsForSet(setId: string): Promise<types.Card[]> {
  const data = await fetchJson(`${constants.CARDS_SETID_URL}${setId}`);
  return data;
}

export async function fetchBlob(url: string): Promise<any> {
  const apiKey = await get.getSecret(constants.SECRETS_KEYS.tcgapiKey);

  try {
    utils.toggleStatusModal(`Fetching ${url}`, 'showstatus');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    utils.toggleStatusModal('', 'hide');

    return response.blob();
  } catch (error) {
    console.error(error);
  }
}
