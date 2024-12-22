import * as constants from './constants.js';
import * as sort from './sort.js';

/**
 * stores binder, set, and header gsheet data in localstorage
 * @param sheetsData all data from sheet
 * @param setsData all set data from tcg api
 */
export function storeData(
  sheetsData: string[][],
  setsData: { id: string; ptcgoCode?: string }[]
): void {
  // Store header
  const header = sheetsData[0] ?? [];
  if (!header.length) return; // Exit early if header is empty
  localStorage.setItem('data_header', JSON.stringify(header));

  // Store container names
  const allBinderNames = getUniqueValuesFromColumn(
    header,
    'binder',
    sheetsData
  );

  const allSetNames: Set<string> = new Set();
  for (const tcgSet of setsData) {
    allSetNames.add(
      `${'ptcgoCode' in tcgSet ? tcgSet['ptcgoCode'] : tcgSet['id']}`
    );
  }

  localStorage.setItem('all_binder_names', JSON.stringify([...allBinderNames]));
  localStorage.setItem('all_set_names', JSON.stringify([...allSetNames]));

  // Store data for each binder
  storeFilteredData(allBinderNames, sheetsData, header, 'binder');
  storeFilteredData(allSetNames, sheetsData, header, 'set');

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

function getUniqueValuesFromColumn(
  header: string[],
  colName: string,
  data: string[][]
) {
  const columnIndex = header.indexOf(colName);
  const allBinderNames = new Set<string>(
    data
      .map((row) => row[columnIndex])
      .filter(
        (value): value is string => value !== undefined && value !== colName
      ) // Filter out `undefined`
  );
  return allBinderNames;
}

export function logSuccess() {
  localStorage.setItem('storage_init', 'SUCCESS');
  localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
