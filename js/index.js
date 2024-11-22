window.onload = () => {
  UI_setSizeAndGrid();
  if (localStorage.getItem('bindername')) {
    CONSTANTS_initialize();
    INDEX_loadFromStorage();
  } else {
    INDEX_fetchAndFillPage();
  }
};

async function INDEX_fetchAndFillPage() {
  const data = await INDEX_fetchData();
  STORE_storeData(data.data);
  PAGE_fillPage();
  UI_populateBinderDropdown();
  UI_populateSetDropdown();
  UI_createProgressBar();
}

function INDEX_loadFromStorage() {
  console.log('loading from storage');
  PAGE_fillPage();
  UI_populateBinderDropdown();
  UI_populateSetDropdown();
  UI_createProgressBar();
}

async function INDEX_fetchData() {
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
