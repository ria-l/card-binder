window.onload = () => {
  if (localStorage.getItem('bindername')) {
    loadFromStorage();
  } else {
    fetchAndFillBinder();
    debugger;
  }
};

async function fetchAndFillBinder() {
  const data = await fetchData();
  storeBinders(data.data);
  fillBinder();
  populateDropdown();
}

async function fetchData() {
  console.log('fetching...');

  const status = document.getElementById('status');
  status.innerHTML = 'loading...';
  status.className = 'showstatus';

  let response = await fetch(appscript_url);
  let data = await response.json();
  status.className = 'hidestatus';
  return data;
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

  setAndStoreCardSize('absolute', cardSize);
  setAndStoreGrid('absolute', gridCol, gridRow);

  fillBinder();
  populateDropdown();
}
