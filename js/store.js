function STORE_storeBinders(data) {
  // puts binder names into a set
  const header = data[0];
  let bindername = localStorage.getItem('bindername');
  localStorage.setItem('header', header);
  if (!bindername) {
    bindername = header[0]; // TODO: make this random
    localStorage.setItem('bindername', bindername);
  }
  const binderNames = new Set();
  const binderIndex = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }

  // parses and stores binder data
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
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
  STORE_storeFileNames(bindername);
  console.log('stored binders');
}

function STORE_storeFileNames(binder) {
  CONSTANTS_initialize();
  data = JSON.parse(localStorage.getItem(binder));
  const filenames = data.map((row) => row[FILENAME_COL]);
  localStorage.setItem('filenames', JSON.stringify([...filenames]));
  console.log(`stored filenames for ${binder}`);
}
