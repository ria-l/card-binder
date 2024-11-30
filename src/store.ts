// TODO: refactor

import * as sort from './sort.js';

/**
 * stores binder, set, and header gsheet data in localstorage
 * @param data all data from sheet
 */
export function storeData(data: string[]) {
  const header = data[0];
  localStorage.setItem('header', JSON.stringify(header));

  // store container names
  const binderCol = header.indexOf('binder');
  let bindernames = data.filter((row) => row[binderCol] != 'binder');
  bindernames = new Set(bindernames.map((row) => row[binderCol]));

  const setCol = header.indexOf('set');
  let setnames = data.filter((row) => row[setCol] != 'set');
  setnames = new Set(setnames.map((row) => row[setCol]));

  localStorage.setItem(`bindernames`, JSON.stringify([...bindernames]));
  localStorage.setItem(`setnames`, JSON.stringify([...setnames]));

  // store set and binder names
  let bindername = localStorage.getItem('bindername');
  if (!bindername) {
    const x = Math.floor(Math.random() * bindernames.size);
    bindername = Array.from(bindernames)[x];
    localStorage.setItem('bindername', bindername);
  }
  let setname = localStorage.getItem('setname');
  if (!setname) {
    const y = Math.floor(Math.random() * setnames.size);
    setname = Array.from(setnames)[y];
    localStorage.setItem('setname', setname);
  }

  // store data for each container
  for (const name of bindernames) {
    // only the cards that are in the given binder
    let filtered = data.filter((row) => row[binderCol] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered)));
  }
  for (const name of setnames) {
    // only the cards that are in the given binder
    let filtered = data.filter((row) => row[setCol] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(name, JSON.stringify(sort.sortByColor(filtered)));
  }
}
