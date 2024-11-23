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

export const sortByColor = (data) => {
  let sorted = data.slice(1);

  sorted = sort('card #', sorted);
  sorted = sort('set', sorted);
  sorted = sort('release date', sorted);
  sorted = sort('card subtype bonus', sorted);
  sorted = sort('card type #', sorted);
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
  sorted = sort('card subtype bonus', sorted);
  sorted = sort('card type #', sorted);
  sorted = sort('forme #', sorted);
  sorted = sort('dex #', sorted);

  return sorted;
};
