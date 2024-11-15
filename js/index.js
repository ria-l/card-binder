let index;

const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive.
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').className = 'status';
  document.getElementById('status').innerHTML = 'loading...';

  console.log('fetching...');
  fetch(appscript_url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      document.getElementById('status').className = 'hidestatus';
      storeBinders(data);
      console.log('data stored');
    })
    .then(() => {
      createTags();
      console.log('tags created');
      fillBinder();
      console.log('binder filled');
      populateDropdown();
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

const populateDropdown = () => {
  const select = document.getElementById('selectBinder');
  const binders = JSON.parse(localStorage.getItem('bindernames'));
  let defaultbinder = localStorage.getItem('bindername');
  if (!defaultbinder) {
    defaultbinder = binders[getRandomInt(0, binders.length)];
  }

  let s = '';
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

const populateSizeAndGrid = () => {
  let imgWidth = parseInt(localStorage.getItem('imgWidth'));
  let col = parseInt(localStorage.getItem('col'));
  let row = parseInt(localStorage.getItem('row'));

  if (!imgWidth) {
    imgWidth = 150;
    localStorage.setItem('imgWidth', 150);
  }
  if (!col) {
    col = 3;
    localStorage.setItem('col', 3);
  }
  if (!row) {
    row = 3;
    localStorage.setItem('row', 3);
  }

  setInputForCardSize('absolute', imgWidth);
  setInputsForGrid('absolute', col, row);
};

/**
 * main!
 * update tests_setup if this changes.
 */
window.onload = () => {
  if (localStorage.getItem('tags')) {
    console.log('loading from storage');
    populateDropdown();
    populateSizeAndGrid();
    createTags();
    fillBinder();
  } else {
    document.getElementById('content').action = appscript_url;
    populateSizeAndGrid();
    fetchAndFillBinder();
    populateDropdown();
  }
};
