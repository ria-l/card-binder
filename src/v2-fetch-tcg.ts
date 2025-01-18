import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as store from './v2-store.js';
import * as types from './v2-types.js';
import * as utils from './v2-utils.js';

export async function fetchAndStoreCardsBySet(setId: string) {
  const data = await fetchJson(`${constants.CARDS_SETID_URL}${setId}`);
  const cards = data.map((row: types.tcgset) => row.id);
  store.storeCardsBySetId(setId, cards);
}

export async function fetchAndStoreSetMetadata() {
  const data = await fetchJson('https://api.pokemontcg.io/v2/sets');
  store.storeSetMetaData(data);
}

export async function fetchJson(url: string): Promise<any> {
  const apiKey = get.getTcgApiKey();

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