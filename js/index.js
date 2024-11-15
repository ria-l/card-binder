window.onload = () => {
  document.getElementById('content').action = appscript_url;

  if (localStorage.getItem('bindername')) {
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
    populateDropdown();
  } else {
    fetchAndFillBinder();
  }
};

async function fetchAndStore() {
  console.log('fetch and store');
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
    .catch((error) => (document.getElementById('content').innerHTML = error));
  console.log('fetched and stored');
}
