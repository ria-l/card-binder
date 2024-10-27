const appscript =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let index;

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').innerHTML = 'loading...';

  let binderName = localStorage.getItem('bindername');

  if (binderName != null) {
    console.log('stuff in storage');
    fillBinder(binderName);
    return;
  }

  console.log('fetching...');
  fetch(appscript)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      storeBinders(data);
      binderName = localStorage.getItem('bindername');
      binderData = JSON.parse(localStorage.getItem(binderName));
      createTags(binderData);
    })
    .then(() => {
      fillBinder(binderName);
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
