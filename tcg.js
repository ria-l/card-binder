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
      createTags();
    })
    .then(() => {
      fillBinder(binderName);
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

const populateDropdown = () => {
  select = document.getElementById('selectBinder');
  binders = JSON.parse(localStorage.getItem('bindernames'));
  console.log(binders);
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
  resizeCards('absolute', 50);
  setInputsForGrid('absolute', 8, 4);
  fetchAndFillBinder();
  populateDropdown();
};
