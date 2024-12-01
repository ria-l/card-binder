// TODO: refactor
import * as sort from './sort.js';
/**
 * stores binder, set, and header gsheet data in localstorage
 * @param data all data from sheet
 */
export function storeData(data) {
    // Ensure the header row is not empty
    const header = data[0] ?? [];
    localStorage.setItem('header', JSON.stringify(header));
    // Store container names
    const binderCol = header.indexOf('binder');
    const bindernames = new Set(data
        .filter((row) => row[binderCol] !== 'binder')
        .map((row) => row[binderCol])
        .filter((name) => name !== undefined) // Filter out `undefined`
    );
    const setCol = header.indexOf('set');
    const setnames = new Set(data
        .filter((row) => row[setCol] !== 'set')
        .map((row) => row[setCol])
        .filter((name) => name !== undefined) // Filter out `undefined`
    );
    // Store bindernames and setnames in localStorage
    localStorage.setItem('bindernames', JSON.stringify([...bindernames]));
    localStorage.setItem('setnames', JSON.stringify([...setnames]));
    // Store set and binder names
    let bindername = localStorage.getItem('bindername');
    if (!bindername) {
        bindername =
            Array.from(bindernames)[Math.floor(Math.random() * bindernames.size)] ??
                '';
        localStorage.setItem('bindername', bindername);
    }
    let setname = localStorage.getItem('setname');
    if (!setname) {
        setname =
            Array.from(setnames)[Math.floor(Math.random() * setnames.size)] ?? '';
        localStorage.setItem('setname', setname);
    }
    // Store data for each binder
    bindernames.forEach((name) => {
        // only the cards that are in the given binder
        const filtered = data.filter((row) => row[binderCol] === name);
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered)));
    });
    // Store data for each set
    setnames.forEach((name) => {
        // only the cards that are in the given set
        const filtered = data.filter((row) => row[setCol] === name);
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered)));
    });
}
//# sourceMappingURL=store.js.map