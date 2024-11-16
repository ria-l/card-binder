window.onload = () => {
  document.getElementById('content').action = appscript_url;

  if (localStorage.getItem('bindername')) {
    loadFromStorage();
  } else {
    fetchAndFillBinder();
  }
};

async function fetchAndFillBinder() {
  console.log('fetch and fill');
  await fetchAndStore();
  fillBinder();
  populateDropdown();
  console.log('fetched and filled');
}

async function fetchAndStore() {
  console.log('fetch and store');

  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  console.log('fetching...');
  let response = await fetch(appscript_url);
  let data = await response.json();
  console.log('fetched');

  storeBinders(data.data);
  console.log('data stored');

  status.className = 'hidestatus';

  console.log('fetched and stored');
}

function loadFromStorage() {
  console.log('loading from storage');

  let cardSize = parseInt(localStorage.getItem('imgWidth'));
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

  setInputForCardSize('absolute', cardSize);
  setInputsForGrid('absolute', gridCol, gridRow);

  fillBinder();
  populateDropdown();
  console.log('loaded from storage');
}
