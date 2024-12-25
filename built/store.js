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
    localStorage.setItem('debug_gsheets_allsheets', JSON.stringify(sheetsData));
    localStorage.setItem('debug_tcg_sets', JSON.stringify(setsData));
    storeSetData({ data: setsData, storageId: 'dex_sets' });
    storeCardData({ data: sheetsData, storageId: 'dex_cards' });
    processAndStoreOtherData({
        data: sheetsData['db-filenames'],
        storageId: 'dex_filenames',
        keyName: 'card_id',
        valName: 'file_name',
        hasDupes: false,
    });
    processAndStoreOtherData({
        data: sheetsData['db-owned'],
        storageId: 'dex_owned',
        keyName: 'card_id',
        valName: 'pulled_date',
        hasDupes: true,
    });
    const cardIdsByBinder = processAndStoreOtherData({
        data: sheetsData['db-binders'],
        storageId: 'dex_binders',
        keyName: 'binder_name',
        valName: 'card_id',
        hasDupes: true,
    });
    // Original
    // Store header
    const dbAll = sheetsData['db-all'];
    const allHeader = dbAll[0] ?? [];
    if (!allHeader.length) {
        return; // Exit early if header is empty
    }
    localStorage.setItem('data_header', JSON.stringify(allHeader));
    // Store container names
    const allBinderNames = Object.keys(cardIdsByBinder);
    const allSetNames = new Set();
    for (const tcgSet of setsData) {
        allSetNames.add(`${'ptcgoCode' in tcgSet ? tcgSet['ptcgoCode'] : tcgSet['id']}`);
    }
    localStorage.setItem('all_binder_names', JSON.stringify([...allBinderNames]));
    localStorage.setItem('all_set_names', JSON.stringify([...allSetNames]));
    // Store data for each set
    storeFilteredData(allSetNames, sheetsData['db-all'], allHeader, 'set');
    // Store set and binder names
    storeRandomNameIfAbsent('active_binder', allBinderNames);
    storeRandomNameIfAbsent('active_set', Array.from(allSetNames));
}
function storeSetData({ data, storageId, }) {
    const toStore = data
        .sort((a, b) => new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf())
        .reduce((acc, { id, name, series }) => {
        acc[`${series}: ${name}`] = `${id}`;
        return acc;
    }, {});
    localStorage.setItem(storageId, JSON.stringify(toStore));
}
function storeCardData({ data, storageId, }) {
    const [header, ...rows] = data['db-cards'];
    if (!header) {
        throw new Error('no content in db-cards');
    }
    const cardsToStore = rows.reduce((rowAcc, currRow) => {
        const entry = header.reduce((accumulator, currCol, currIndex) => {
            // creates the dict of metadata
            accumulator[currCol] = currRow[currIndex];
            return accumulator;
        }, {});
        const cardId = entry['card_id'];
        if (!cardId) {
            throw new Error(`no card id in ${header}`);
        }
        rowAcc[cardId] = entry;
        return rowAcc;
    }, {});
    localStorage.setItem(storageId, JSON.stringify(cardsToStore));
}
/**
 *
 * @param keyName col name that will be the key in the final object
 * @param valName col name that will be the val in the final object
 */
function processAndStoreOtherData({ data, storageId, keyName, valName, hasDupes, }) {
    const [header, ...rows] = data;
    if (!header) {
        throw new Error(`No content in sheet: ${data.slice(0, 1)}`);
    }
    const keyIndex = header.indexOf(keyName);
    const valIndex = header.indexOf(valName);
    if (keyIndex === -1 || valIndex === -1) {
        throw new Error(`${keyName} or ${valName} column(s) not found in sheet: ${data.slice(0, 1)}`);
    }
    const processed = rows.reduce((accumulator, currRow) => {
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
    localStorage.setItem(storageId, JSON.stringify(processed));
    return processed;
}
/**
 *
 * @param storageKey 'active_binder' or 'active_set'
 * @param allBinderNames
 */
export function storeRandomNameIfAbsent(storageKey, allBinderNames) {
    let storedName = localStorage.getItem(storageKey);
    if (!storedName) {
        storedName =
            Array.from(allBinderNames)[Math.floor(Math.random() * allBinderNames.length)] ?? '';
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