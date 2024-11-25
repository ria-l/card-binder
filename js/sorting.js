import * as page from './page.js';
import * as constants from './constants.js';

export function newSort() {
  const sortBy = document.getElementById('sortDropdown').value;
  const data = page.getDataToDisplay();
  const container = localStorage.getItem('container');
  const header = localStorage.getItem('header').split(',');
  let col;
  let name;
  if (container == 'binder') {
    col = header.indexOf('binder');
    name = localStorage.bindername;
  } else {
    col = header.indexOf('set');
    name = localStorage.setname;
  }
  let filtered = data.filter((row) => row[col] == name);
  filtered.unshift(header);

  if (sortBy == 'Dex #') {
    localStorage.setItem(name, JSON.stringify(sortByDex(filtered)));
  } else if (sortBy == 'Pokemon Type') {
    localStorage.setItem(name, JSON.stringify(sortByColor(filtered)));
  } else if (sortBy == 'Card Type') {
    localStorage.setItem(name, JSON.stringify(sortByCardType(filtered)));
  } else if (sortBy == 'Set Number') {
    localStorage.setItem(name, JSON.stringify(sortBySetNum(filtered)));
  } else if (sortBy == 'Visuals') {
    localStorage.setItem(name, JSON.stringify(sortByVisuals(filtered)));
  }
  page.fillPage();
}

const sort = (col_name, data) => {
  const header = localStorage.getItem('header').split(',');
  const column = header.indexOf(col_name);
  return data.sort((a, b) => {
    if (a[column] === b[column]) {
      return 0;
    } else {
      return a[column] < b[column] ? -1 : 1;
    }
  });
};

export const sortByCardType = (data) => {
  let sorted = data.slice(1); // TODO: get rid of the need for slicing

  sorted = sort('card #', sorted);
  sorted = sort('set', sorted);
  sorted = sort('release date', sorted);
  sorted = sort('forme #', sorted);
  sorted = sort('dex #', sorted);
  sorted = sort('pkmn type #', sorted);
  sorted = sort('card type #', sorted);

  return sorted;
};

export const sortByVisuals = (data) => {
  let sorted = data.slice(1);

  sorted = sort('card #', sorted);
  sorted = sort('set', sorted);
  sorted = sort('release date', sorted);
  sorted = sort('forme #', sorted);
  sorted = sort('dex #', sorted);
  sorted = sort('pkmn type #', sorted);
  sorted = sort('card type #', sorted);
  sorted = sort('visuals #', sorted);

  return sorted;
};
export const sortByColor = (data) => {
  let sorted = data.slice(1);

  sorted = sort('card #', sorted);
  sorted = sort('set', sorted);
  sorted = sort('release date', sorted);
  sorted = sort('card type #', sorted);
  sorted = sort('visuals #', sorted);
  sorted = sort('forme #', sorted);
  sorted = sort('dex #', sorted);
  sorted = sort('pkmn type #', sorted);

  return sorted;
};

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

export const sortBySetNum = (data) => {
  let sorted = data.slice(1);

  sorted = sort('card #', sorted);
  sorted = sort('set', sorted);

  return sorted;
};
