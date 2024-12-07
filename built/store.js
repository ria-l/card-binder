import * as sort from './sort.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param data all data from sheet
 */
export function storeData(data) {
    // Store header
    const header = data[0] ?? [];
    if (!header.length)
        return; // Exit early if header is empty
    localStorage.setItem('header', JSON.stringify(header));
    // Store container names
    const bindernames = getUniqueValuesFromColumn(header, 'binder', data);
    const setnames = getUniqueValuesFromColumn(header, 'set', data);
    // Store bindernames and setnames in localStorage
    localStorage.setItem('bindernames', JSON.stringify([...bindernames]));
    localStorage.setItem('setnames', JSON.stringify([...setnames]));
    // Store data for each binder
    storeFilteredData(bindernames, data, header, 'binder');
    storeFilteredData(setnames, data, header, 'set');
    // Store set and binder names
    storeRandomNameIfAbsent('bindername', bindernames);
    storeRandomNameIfAbsent('setname', setnames);
}
function storeRandomNameIfAbsent(key, bindernames) {
    let storedName = localStorage.getItem(key);
    if (!storedName) {
        storedName =
            Array.from(bindernames)[Math.floor(Math.random() * bindernames.size)] ??
                '';
        localStorage.setItem(key, storedName);
    }
}
/**
 * Store only the cards for the given container
 * @param names
 * @param data
 * @param header
 * @param columnName
 */
function storeFilteredData(names, data, header, columnName) {
    const columnIndex = header.indexOf(columnName);
    names.forEach((name) => {
        const filtered = data.filter((row) => row[columnIndex] === name);
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered)));
    });
}
function getUniqueValuesFromColumn(header, columnName, data) {
    const columnIndex = header.indexOf(columnName);
    const bindernames = new Set(data
        .map((row) => row[columnIndex])
        .filter((value) => value !== undefined && value !== columnName) // Filter out `undefined`
    );
    return bindernames;
}
//# sourceMappingURL=store.js.map