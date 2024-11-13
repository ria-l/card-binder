let index;

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
  const defaultbinder = localStorage.getItem('bindername');
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

/**
 * main!
 * update tests_setup if this changes.
 */
window.onload = () => {
  document.getElementById('content').action = appscript_url;

  if (localStorage.getItem('bindername')) {
    // debugger;
    console.log('loading from storage');
    localStorage.getItem('imgWidth')
      ? (imgWidth = parseInt(localStorage.getItem('imgWidth')))
      : (imgWidth = 150);
    localStorage.getItem('col')
      ? (col = parseInt(localStorage.getItem('col')))
      : (col = 3);
    localStorage.getItem('row')
      ? (row = parseInt(localStorage.getItem('row')))
      : (row = 3);

    setInputForCardSize('absolute', imgWidth);
    setInputsForGrid('absolute', col, row);

    createTags();
    fillBinder();
  } else {
    fetchAndFillBinder();
  }
};
