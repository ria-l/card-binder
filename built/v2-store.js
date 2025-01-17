import * as sort from './v2-sort.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param data all data from sheet
 */
export function storeData(data) {
    // Store header
    const header = data[0] ?? [];
    if (!header.length)
        return; // Exit early if header is empty
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
//# sourceMappingURL=v2-store.js.map