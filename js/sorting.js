const sort = (header, col_name, data) => {
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
  const header = data[0];
  let sorted = data.slice(1);

  sorted = sort(header, 'card #', sorted);
  sorted = sort(header, 'set', sorted);
  sorted = sort(header, 'release date', sorted);
  sorted = sort(header, 'forme #', sorted);
  sorted = sort(header, 'dex #', sorted);
  sorted = sort(header, 'pkmn type #', sorted);
  sorted = sort(header, 'card type #', sorted);

  return sorted;
};

export const sortByColor = (data) => {
  const header = data[0];
  let sorted = data.slice(1);

  sorted = sort(header, 'card #', sorted);
  sorted = sort(header, 'set', sorted);
  sorted = sort(header, 'release date', sorted);
  sorted = sort(header, 'card subtype bonus', sorted);
  sorted = sort(header, 'card type #', sorted);
  sorted = sort(header, 'forme #', sorted);
  sorted = sort(header, 'dex #', sorted);
  sorted = sort(header, 'pkmn type #', sorted);

  return sorted;
};

export const sortByDex = (data) => {
  const header = data[0];
  let sorted = data.slice(1);

  sorted = sort(header, 'card #', sorted);
  sorted = sort(header, 'set', sorted);
  sorted = sort(header, 'release date', sorted);
  sorted = sort(header, 'card subtype bonus', sorted);
  sorted = sort(header, 'card type #', sorted);
  sorted = sort(header, 'forme #', sorted);
  sorted = sort(header, 'dex #', sorted);

  return sorted;
};
