import * as sort from './sort.js';

/**
 *
 * @param {json obj} data all data from sheet
 */
export function storeData(data) {
  const header = data[0];
  localStorage.setItem('header', header);

  // store binder name
  let bindername = localStorage.getItem(`bindername`);
  if (!bindername) {
    bindername = header[0]; // TODO: make this random
    localStorage.setItem(`bindername`, bindername);
  }
  let setname = localStorage.getItem(`setname`);
  if (!setname) {
    setname = 'PAL'; // TODO: make this random
    localStorage.setItem(`setname`, setname);
  }

  // store container names
  const binderCol = header.indexOf('binder');
  let bindernames = data.filter((row) => row[binderCol] != 'binder');
  bindernames = new Set(bindernames.map((row) => row[binderCol]));

  const setCol = header.indexOf('set');
  let setnames = data.filter((row) => row[setCol] != 'set');
  setnames = new Set(setnames.map((row) => row[setCol]));

  localStorage.setItem(`bindernames`, JSON.stringify([...bindernames]));
  localStorage.setItem(`setnames`, JSON.stringify([...setnames]));

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
