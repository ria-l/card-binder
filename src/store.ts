import * as sort from './sort.js';

/**
 * stores binder, set, and header gsheet data in localstorage
 * @param data all data from sheet
 */
export function storeData(data: string[][]): void {
  // Store header
  const header = data[0] ?? [];
  if (!header.length) return; // Exit early if header is empty
  localStorage.setItem('data_header', JSON.stringify(header));

  // Store container names
  const allBinderNames = getUniqueValuesFromColumn(header, 'binder', data);
  const allSetNames = getUniqueValuesFromColumn(header, 'set', data);

  // Store allBinderNames and allSetNames in localStorage
  localStorage.setItem('all_binder_names', JSON.stringify([...allBinderNames]));
  localStorage.setItem('all_set_names', JSON.stringify([...allSetNames]));

  // Store data for each binder
  storeFilteredData(allBinderNames, data, header, 'binder');
  storeFilteredData(allSetNames, data, header, 'set');

  // Store set and binder names
  storeRandomNameIfAbsent('active_binder', allBinderNames);
  storeRandomNameIfAbsent('active_set', allSetNames);
}

/**
 *
 * @param key 'active_binder' or 'active_set'
 * @param allBinderNames
 */
function storeRandomNameIfAbsent(key: string, allBinderNames: Set<string>) {
  let storedName = localStorage.getItem(key); // TODO: refactor collection type vars
  if (!storedName) {
    storedName =
      Array.from(allBinderNames)[
        Math.floor(Math.random() * allBinderNames.size)
      ] ?? '';
    localStorage.setItem(key, storedName); // TODO: refactor collection type vars
  }
}

/**
 * Store only the cards for the given collection
 * @param names
 * @param data
 * @param header
 * @param columnName
 */
function storeFilteredData(
  names: Set<string>,
  data: string[][],
  header: string[],
  columnName: string
) {
  const columnIndex = header.indexOf(columnName);
  names.forEach((name) => {
    const filtered = data.filter((row) => row[columnIndex] === name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered))); // TODO: refactor collection type vars
  });
}

function getUniqueValuesFromColumn(
  header: string[],
  columnName: string,
  data: string[][]
) {
  const columnIndex = header.indexOf(columnName);
  const allBinderNames = new Set<string>(
    data
      .map((row) => row[columnIndex])
      .filter(
        (value): value is string => value !== undefined && value !== columnName
      ) // Filter out `undefined`
  );
  return allBinderNames;
}
