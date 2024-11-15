let sorted;

const sortMatrix = (a, b) => {
  if (a[index] === b[index]) {
    return 0;
  } else {
    return a[index] < b[index] ? -1 : 1;
  }
};

const _sort = (header, col_name, data) => {
  index = header.indexOf(col_name);
  return data.sort(sortMatrix);
};

// const sortByColor = (data) => {
//   header = data[0];
//   sorted = data.slice(1);

//   sorted = _sort(header, 'card #', sorted);
//   sorted = _sort(header, 'set', sorted);
//   sorted = _sort(header, 'release date', sorted);
//   sorted = _sort(header, 'forme #', sorted);
//   sorted = _sort(header, 'dex #', sorted);
//   sorted = _sort(header, 'pkmn type #', sorted);
//   sorted = _sort(header, 'card type #', sorted);

//   return sorted;
// };

const sortByColor = (data) => {
  header = data[0];
  sorted = data.slice(1);

  sorted = _sort(header, 'card #', sorted);
  sorted = _sort(header, 'set', sorted);
  sorted = _sort(header, 'release date', sorted);
  sorted = _sort(header, 'card subtype bonus', sorted);
  sorted = _sort(header, 'card type #', sorted);
  sorted = _sort(header, 'forme #', sorted);
  sorted = _sort(header, 'dex #', sorted);
  sorted = _sort(header, 'pkmn type #', sorted);

  return sorted;
};

const sortByDex = (data) => {
  header = data[0];
  sorted = data.slice(1);

  sorted = _sort(header, 'card #', sorted);
  sorted = _sort(header, 'set', sorted);
  sorted = _sort(header, 'release date', sorted);
  sorted = _sort(header, 'card subtype bonus', sorted);
  sorted = _sort(header, 'card type #', sorted);
  sorted = _sort(header, 'forme #', sorted);
  sorted = _sort(header, 'dex #', sorted);

  return sorted;
};

const _subtype_values = {
  shiny: 1,
  gold: 2,
  tera: 3,
  'full art': 4,
  rainbow: 5,
  'solid color': 6,
  illust: 7,
};
