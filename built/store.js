import * as constants from './constants.js';
import * as sort from './sort.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param sheetsData all data from sheet
 * @param setsData all set data from tcg api
 */
export function storeData(sheetsData, setsData) {
    // Store header
    const header = sheetsData[0] ?? [];
    if (!header.length)
        return; // Exit early if header is empty
    localStorage.setItem('data_header', JSON.stringify(header));
    // Store container names
    const allBinderNames = getUniqueValuesFromColumn(header, 'binder', sheetsData);
    const allSetNames = new Set();
    for (const tcgSet of setsData) {
        allSetNames.add(`${'ptcgoCode' in tcgSet ? tcgSet['ptcgoCode'] : tcgSet['id']}`);
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
function storeRandomNameIfAbsent(storageKey, allBinderNames) {
    let storedName = localStorage.getItem(storageKey);
    if (!storedName) {
        storedName =
            Array.from(allBinderNames)[Math.floor(Math.random() * allBinderNames.size)] ?? '';
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
function storeFilteredData(allCollectionNames, data, header, colName) {
    const columnIndex = header.indexOf(colName);
    allCollectionNames.forEach((collectionName) => {
        const filtered = data.filter((row) => row[columnIndex] === collectionName);
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(collectionName, JSON.stringify(sort.sortByColor(filtered)));
    });
}
function getUniqueValuesFromColumn(header, colName, data) {
    const columnIndex = header.indexOf(colName);
    const allBinderNames = new Set(data
        .map((row) => row[columnIndex])
        .filter((value) => value !== undefined && value !== colName) // Filter out `undefined`
    );
    return allBinderNames;
}
export function logSuccess() {
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
//# sourceMappingURL=store.js.map