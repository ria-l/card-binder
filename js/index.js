window.onload = () => {
  _setSizeAndGrid();
  if (localStorage.getItem('bindername')) {
    loadFromStorage();
  } else {
    fetchAndFillBinder();
  }
};

async function fetchAndFillBinder() {
  const data = await _fetchData();
  storeBinders(data.data);
  fillBinder();
  populateDropdown();
}

function loadFromStorage() {
  console.log('loading from storage');
  fillBinder();
  populateDropdown();
}

function _setSizeAndGrid() {
  let cardSize = parseInt(localStorage.getItem('cardSize'));
  let gridCol = parseInt(localStorage.getItem('col'));
  let gridRow = parseInt(localStorage.getItem('row'));

  if (isNaN(cardSize)) {
    cardSize = 150;
  }
  if (isNaN(gridCol)) {
    gridCol = 0;
  }
  if (isNaN(gridRow)) {
    gridRow = 0;
  }

  setAndStoreCardSize('absolute', cardSize);
  setAndStoreGrid('absolute', gridCol, gridRow);
}

async function _fetchData() {
  console.log('fetching...');
  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  const response = await fetch(APPSCRIPT_URL);
  const data = await response.json();
  status.className = 'hidestatus';
  console.log('fetched');

  return data;
}
