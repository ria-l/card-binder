// todo: sort by set & card number
// todo: sort by dex

const sortMatrix = (a, b) => {
  if (a[index] === b[index]) {
    return 0;
  } else {
    return a[index] < b[index] ? -1 : 1;
  }
};

const sortByColor = (data) => {
  header = data[0];
  unsorted = data.slice(1);

  index = header.indexOf('card #');
  byCardNum = unsorted.sort(sortMatrix);

  index = header.indexOf('release date');
  byRelease = byCardNum.sort(sortMatrix);

  index = header.indexOf('dex #');
  byDex = byRelease.sort(sortMatrix);

  index = header.indexOf('pkmn type #');
  byPkmnType = byDex.sort(sortMatrix);

  index = header.indexOf('card type #');
  byCardType = byPkmnType.sort(sortMatrix);

  return byCardType;
};
