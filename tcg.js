const url =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let index;
localStorage.clear();
console.log('cleared storage');

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').innerHTML = 'loading...';

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      // get the column names
      header = data[0];
      // filter only the card rows
      shinies = data.filter((row) => row[1] == 'shiny');
      // add back the header
      shinies.unshift(header);
      toStore = sortByColor(shinies);
      localStorage.setItem('data', JSON.stringify(toStore));
      createTags(toStore);
    })
    .then(() => {
      fillBinder('data');
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

/**
 * main!
 */
window.onload = () => {
  document.getElementById('content').action = url;
  resizeCards('absolute', 50);
  setInputsForGrid('absolute', 8, 4);
  fetchAndFillBinder();
};
