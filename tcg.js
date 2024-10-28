const appscript =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let index;

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').innerHTML = 'loading...';

  console.log('fetching...');
  fetch(appscript)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      storeBinders(data);
      createTags();
    })
    .then(() => {
      fillBinder();
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

const populateDropdown = () => {
  select = document.getElementById('selectBinder');
  binders = JSON.parse(localStorage.getItem('bindernames'));
  defaultbinder = localStorage.getItem('bindername');
  s = '';
  for (e of binders) {
    if (e != 'binder' && e != defaultbinder) {
      s += `<option value="${e}">${e}</option>`;
    }
    if (e == defaultbinder) {
      s += `<option value="${e}" selected="selected">${e}</option>`;
    }
  }
  select.innerHTML = s;
};

const storeNewBinder = () => {
  select = document.getElementById('selectBinder');
  localStorage.setItem('bindername', select.options[select.selectedIndex].text);
};

/**
 * main!
 */
window.onload = () => {
  document.getElementById('content').action = appscript;
  setInputForCardSize('absolute', 50);
  setInputsForGrid('absolute', 8, 4);

  const binderName = localStorage.getItem('bindername');
  if (binderName) {
    console.log('loading from storage');
    fillBinder();
  } else {
    fetchAndFillBinder();
  }
  populateDropdown();
};
