import * as constants from './constants.js';
import * as sort from './sort.js';
import * as types from './types.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param sheetsData all data from sheet
 * @param setsData all set data from tcg api
 */
export function storeData(sheetsData, setsData) {
    // Store raw data
    localStorage.setItem('raw_gsheets_allsheets', JSON.stringify(sheetsData));
    localStorage.setItem('raw_tcg_sets', JSON.stringify(setsData));
    // Convert and store sheets data
    localStorage.setItem('dex_cards', JSON.stringify(convertToObjById(sheetsData['db-cards'])));
    localStorage.setItem('dex_sets', JSON.stringify(convertToObjById(sheetsData['db-sets'])));
    localStorage.setItem('dex_filenames', JSON.stringify(convertToArrayById(sheetsData['db-filenames'], 'card_id', 'file_name', false)));
    localStorage.setItem('dex_owned', JSON.stringify(convertToArrayById(sheetsData['db-owned'], 'card_id', 'pulled_date', true)));
    localStorage.setItem('dex_binders', JSON.stringify(convertToArrayById(sheetsData['db-binders'], 'binder_name', 'card_id', true)));
    // Original
    // Store header
    const dbAll = sheetsData['db-all'];
    const allHeader = dbAll[0] ?? [];
    if (!allHeader.length) {
        return; // Exit early if header is empty
    }
    localStorage.setItem('data_header', JSON.stringify(allHeader));
    // Store container names
    const allBinderNames = getUniqueColVals({
        colName: 'binder_name',
        data: sheetsData['db-binders'],
    });
    const allSetNames = new Set();
    for (const tcgSet of setsData) {
        allSetNames.add(`${'ptcgoCode' in tcgSet ? tcgSet['ptcgoCode'] : tcgSet['id']}`);
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
 * @param data
 * @param key col name that will be the key in the final object
 * @param val col name that will be the val in the final object
 */
function convertToArrayById(data, keyName, valName, hasDupes) {
    const [header, ...rows] = data;
    if (!header) {
        throw new Error(`No content in sheet: ${data.slice(0, 1)}`);
    }
    const keyIndex = header.indexOf(keyName);
    const valIndex = header.indexOf(valName);
    if (keyIndex === -1 || valIndex === -1) {
        throw new Error(`${keyName} or ${valName} column(s) not found in sheet: ${data.slice(0, 1)}`);
    }
    return rows.reduce((accumulator, currRow) => {
        const key = currRow[keyIndex] || 'none';
        const val = currRow[valIndex] || 'none';
        if (hasDupes) {
            if (Array.isArray(accumulator[key])) {
                accumulator[key].push(val);
            }
            else {
                accumulator[key] = [val];
            }
        }
        else {
            accumulator[key] = val;
        }
        return accumulator;
    }, {});
}
// TODO: tidy this up
function convertToObjById(data) {
    const [header, ...rows] = data;
    if (!header) {
        throw new Error(`No content in data object}`);
    }
    return rows.reduce((acc, row) => {
        const item = header.reduce((obj, colName, i) => {
            // colName as keyof T tells TypeScript that colName is guaranteed to be one of the keys of T.
            obj[colName] = row[i];
            return obj;
        }, {});
        // Use the value of 'card_id' (or the first column) as the key
        acc[item[header[0]]] = item;
        return acc;
    }, {});
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
function getUniqueColVals(params) {
    const { colName, data } = params;
    const header = data[0];
    const columnIndex = header.indexOf(colName);
    const uniqueVals = new Set(data
        .map((row) => row[columnIndex])
        .filter((value) => value !== undefined && value !== colName));
    return uniqueVals;
}
export function logSuccess() {
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
//# sourceMappingURL=store.js.map