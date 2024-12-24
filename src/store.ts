import * as constants from './constants.js';
import * as interfaces from './interfaces.js';
import * as sort from './sort.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param sheetsData all data from sheet
 * @param setsData all set data from tcg api
 */
export function storeData(
  sheetsData: interfaces.sheetsData,
  setsData: { id: string; ptcgoCode?: string }[]
): void {
  // Store raw data
  localStorage.setItem('raw_gsheets_allsheets', JSON.stringify(sheetsData));
  localStorage.setItem('raw_tcg_sets', JSON.stringify(setsData));

  // Store new dex_cards object
  const dbCards = sheetsData['db-cards'];
  const cardsHeader = dbCards[0]!;

  const dexCards: interfaces.dexCards = {};
  for (const cardRow of dbCards.slice(1)) {
    const vals: { [key: string]: any } = {};
    for (const [i, v] of cardRow.entries()) {
      vals[cardsHeader[i]!] = v;
    }
    const idCol = cardsHeader.indexOf('card_id');
    if (idCol === -1) {
      throw new Error(`card_id not found in header: ${cardsHeader}`);
    }
    dexCards[cardRow[idCol]!] = vals;
  }
  localStorage.setItem('dex_cards', JSON.stringify(dexCards));

  // Store header
  const dbAll = sheetsData['db-all'];
  const allHeader = dbAll[0] ?? [];
  if (!allHeader.length) return; // Exit early if header is empty
  localStorage.setItem('data_header', JSON.stringify(allHeader));

  // Store container names
  const allBinderNames = getUniqueColVals({
    colName: 'binder_name',
    data: sheetsData['db-binders'],
  });

  const allSetNames: Set<string> = new Set();
  for (const tcgSet of setsData) {
    allSetNames.add(
      `${'ptcgoCode' in tcgSet ? tcgSet['ptcgoCode'] : tcgSet['id']}`
    );
  }

  localStorage.setItem('all_binder_names', JSON.stringify([...allBinderNames]));
  localStorage.setItem('all_set_names', JSON.stringify([...allSetNames]));

  // Store data for each binder
  storeFilteredData(allBinderNames, sheetsData['db-all'], allHeader, 'binder');
  storeFilteredData(allSetNames, sheetsData['db-all'], allHeader, 'set');

  // Store set and binder names
  storeRandomNameIfAbsent('active_binder', allBinderNames);
  storeRandomNameIfAbsent('active_set', allSetNames);
}

/**
 *
 * @param storageKey 'active_binder' or 'active_set'
 * @param allBinderNames
 */
function storeRandomNameIfAbsent(
  storageKey: string,
  allBinderNames: Set<string>
) {
  let storedName = localStorage.getItem(storageKey);
  if (!storedName) {
    storedName =
      Array.from(allBinderNames)[
        Math.floor(Math.random() * allBinderNames.size)
      ] ?? '';
    localStorage.setItem(storageKey, storedName);
  }
}

/**
 * Store only the cards for the given collection
 * @param allCollectionNames
 * @param data
 * @param header
 * @param colName
 */
function storeFilteredData(
  allCollectionNames: Set<string>,
  data: string[][],
  header: string[],
  colName: string
) {
  const columnIndex = header.indexOf(colName);
  allCollectionNames.forEach((collectionName) => {
    const filtered = data.filter((row) => row[columnIndex] === collectionName);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(
      collectionName,
      JSON.stringify(sort.sortByColor(filtered))
    );
  });
}

function getUniqueColVals(params: { colName: string; data: string[][] }) {
  const { colName, data } = params;
  const header = data[0]!;
  const columnIndex = header.indexOf(colName)!;
  const uniqueVals = new Set<string>(
    data
      .map((row) => row[columnIndex])
      .filter(
        (value): value is string => value !== undefined && value !== colName
      )
  );
  return uniqueVals;
}

export function logSuccess() {
  localStorage.setItem('storage_init', 'SUCCESS');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
