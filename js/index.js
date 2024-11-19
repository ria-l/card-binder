window.onload = () => {
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

  let cardSize = parseInt(localStorage.getItem('cardSize'));
  let gridCol = parseInt(localStorage.getItem('col'));
  let gridRow = parseInt(localStorage.getItem('row'));

  if (!cardSize) {
    cardSize = 150;
  }
  if (!gridCol) {
    gridCol = 3;
  }
  if (!gridRow) {
    gridRow = 3;
  }

  setAndStoreCardSize('absolute', cardSize);
  setAndStoreGrid('absolute', gridCol, gridRow);

  fillBinder();
  populateDropdown();
}

async function _fetchData() {
  console.log('fetching...');
  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  const response = await fetch(appscript_url);
  const data = await response.json();
  status.className = 'hidestatus';
  console.log('fetched');

  return data;
}
