const appscript =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let index;
localStorage.clear();
console.log('cleared storage');

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').innerHTML = 'loading...';

  fetch(appscript)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      storeBinders(data);
      createTags(JSON.parse(localStorage.getItem('shiny')));
    })
    .then(() => {
      fillBinder('shiny');
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

/**
 * main!
 */
window.onload = () => {
  document.getElementById('content').action = appscript;
  resizeCards('absolute', 50);
  setInputsForGrid('absolute', 8, 4);
  fetchAndFillBinder();
};
