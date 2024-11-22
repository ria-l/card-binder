function STORE_storeData(data) {
  // store header
  const header = data[0];
  localStorage.setItem('header', header);
  STORE_storeBinders(header, data);
  STORE_storeSets(header, data);
  CONSTANTS_initialize();
}

function STORE_storeBinders(header, data) {
  let bindername = localStorage.getItem('bindername');
  if (!bindername) {
    bindername = header[0]; // TODO: make this random
    localStorage.setItem('bindername', bindername);
  }
  // store binder names
  const binderNames = new Set();
  const binderCol = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderCol]);
  }
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
  // store data for each binder
  for (const bName of binderNames) {
    // only the cards that are in the given binder
    filterAndSort(data, binderCol, bName, header);
  }
  // store filenames for current binder
  STORE_storeFileNames('binder', bindername);
}

/**
 * 
 * @param {*} data 
 * @param {int} col column number for set or binder
 * @param {string} bsName binder or set name
 * @param {array of strings} header from the gSheet
 */
function filterAndSort(data, col, bsName, header) {
  filtered = data.filter((row) => row[col] == bsName);
  // add back the header, since it would be removed during filtering
  filtered.unshift(header);
  localStorage.setItem(bsName, JSON.stringify(sortByColor(filtered)));
}

function STORE_storeSets(header, data) {
  let setname = localStorage.getItem('setname');
  if (!setname) {
    setname = 'PAL'; // TODO: make this random
    localStorage.setItem('setname', setname);
  }
  // store set names
  const setNames = new Set();
  const setCol = header.indexOf('set');
  for (const row of data) {
    setNames.add(row[setCol]);
  }
  localStorage.setItem('setnames', JSON.stringify([...setNames]));
  // store data for each binder
  for (const sName of setNames) {
    filterAndSort(data, setCol, sName, header);
  }
  // store filenames for current binder
  STORE_storeFileNames('set', setname);
}

/**
 *
 * @param {string} type binder or set
 * @param {string} _name name of binder or set
 */
function STORE_storeFileNames(type, _name) {
  CONSTANTS_initialize();
  data = JSON.parse(localStorage.getItem(_name));
  const filenames = data.map((row) => row[FILENAME_COL]);
  localStorage.setItem(`${type}_filenames`, JSON.stringify([...filenames]));
}
