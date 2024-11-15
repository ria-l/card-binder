let index;
/**
 *  The maximum is exclusive and the minimum is inclusive.

 * @param {int} min 
 * @param {int} max 
 * @returns 
 */
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

/**
 * Initial data fetch and binder fill.
 */
async function fetchData() {
  document.getElementById('status').className = 'status';
  document.getElementById('status').innerHTML = 'loading...';
  console.log('fetching...');
  let res;
  try {
    res = await fetch(appscript_url);
    if (res.ok) {
      console.log(`fetched`);
      document.getElementById('status').className = 'hidestatus';
      return res.json();
    } else {
      document.getElementById(
        'content'
      ).innerHTML = `Response status: ${res.status}`;
    }
  } catch (e) {
    document.getElementById('content').innerHTML = `Error: ${e}`;
  }
}

function populateDropdown() {
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
}

function storeNewBinder() {
  select = document.getElementById('selectBinder');
  localStorage.setItem('bindername', select.options[select.selectedIndex].text);
}

function populateSizeAndGrid() {
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
}

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
    refetch();
  }
};

async function refetch() {
  const res = await fetchData();
  storeHeader(res.data);
  storeBinders(res.data);
  createTags();
  fillBinder();
  populateDropdown();
}

function storeHeader(data) {
  localStorage.setItem('header', data[0]);
}
