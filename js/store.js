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
  const binderIndex = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
  // store data for each binder
  for (const name of binderNames) {
    // only the cards that are in the given binder
    filtered = data.filter((row) => row[binderIndex] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    if (name == 'illust') {
      toStore = sortByDex(filtered);
    } else {
      toStore = sortByColor(filtered);
    }
    localStorage.setItem(name, JSON.stringify(toStore));
  }
  // store filenames for current binder
  STORE_storeFileNames('binder', bindername);
}

function STORE_storeSets(header, data) {
  let setname = localStorage.getItem('setname');
  if (!setname) {
    setname = 'PAL'; // TODO: make this random
    localStorage.setItem('setname', setname);
  }
  // store set names
  const setNames = new Set();
  const setIndex = header.indexOf('set');
  for (const row of data) {
    setNames.add(row[setIndex]);
  }
  localStorage.setItem('setnames', JSON.stringify([...setNames]));
  // store data for each binder
  for (const name of setNames) {
    // only the cards that are in the given binder
    filtered = data.filter((row) => row[setIndex] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(name, JSON.stringify(sortByColor(filtered)));
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
