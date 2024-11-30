// TODO: get rid of the need for slicing
import * as page from './page.js';
/**
 * sorts and redisplays current cards based on selected sort value
 */
export function newSort() {
    const sortBy = document.getElementById('sortDropdown')
        .value;
    const data = page.getDataToDisplay();
    const container = localStorage.getItem('container') || 'binder';
    const header = JSON.parse(localStorage.getItem('header') ?? '[]');
    let col;
    let name;
    if (container == 'binder') {
        col = header.indexOf('binder');
        name = localStorage.bindername;
    }
    else {
        col = header.indexOf('set');
        name = localStorage.setname;
    }
    let filtered = data.filter((row) => row[col] == name);
    filtered.unshift(header);
    if (sortBy == 'Dex #') {
        localStorage.setItem(name, JSON.stringify(sortByDex(filtered)));
    }
    else if (sortBy == 'Energy Type') {
        localStorage.setItem(name, JSON.stringify(sortByColor(filtered)));
    }
    else if (sortBy == 'Card Type') {
        localStorage.setItem(name, JSON.stringify(sortByCardType(filtered)));
    }
    else if (sortBy == 'Set Number') {
        localStorage.setItem(name, JSON.stringify(sortBySetNum(filtered)));
    }
    else if (sortBy == 'Visuals') {
        localStorage.setItem(name, JSON.stringify(sortByVisuals(filtered)));
    }
    else if (sortBy == 'recent') {
        localStorage.setItem(name, JSON.stringify(sortByRecent(filtered)));
    }
    page.fillPage();
}
/**
 * sorts given data based on given column
 * @param col_name
 * @param data
 * @returns
 */
const sort = (col_name, data) => {
    const header = JSON.parse(localStorage.getItem('header') ?? '[]');
    const column = header.indexOf(col_name);
    return data.sort((a, b) => {
        if (a[column] === b[column]) {
            return 0;
        }
        else {
            return a[column] < b[column] ? -1 : 1;
        }
    });
};
/**
 * sorts by v, ex, etc
 * @param data
 * @returns
 */
export const sortByCardType = (data) => {
    let sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    sorted = sort('card type #', sorted);
    return sorted;
};
/**
 * sort by illust, full art, etc
 * @param data
 * @returns
 */
export const sortByVisuals = (data) => {
    let sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('card type #', sorted);
    return sorted;
};
/**
 * sort by energy type
 * @param data
 * @returns
 */
export const sortByColor = (data) => {
    let sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('card type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    return sorted;
};
/**
 * sort by national dex #
 * @param data
 * @returns
 */
export const sortByDex = (data) => {
    let sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('card type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    return sorted;
};
/**
 * sort by set and # within a set
 * @param data
 * @returns
 */
export const sortBySetNum = (data) => {
    let sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    return sorted;
};
/**
 * sort by recently pulled
 * @param data
 * @returns
 */
export const sortByRecent = (data) => {
    let sorted = data.slice(1);
    sorted = sort('caught date', sorted);
    sorted.reverse();
    return sorted;
};
//# sourceMappingURL=sort.js.map