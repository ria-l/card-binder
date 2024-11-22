function UI_setSizeAndGrid() {
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
  const rowselect = document.getElementById('row-dropdown');
  if (rowselect.options.length == 0) {
    UI_populateGridDropdowns();
  }
  const sizeselect = document.getElementById('size-dropdown');
  if (sizeselect.options.length == 0) {
    UI_populateSizeDropdown();
  }
  UI_setAndStoreCardSize(cardSize);
  UI_setAndStoreGrid(gridCol, gridRow);
}

function UI_setAndStoreGrid(col, row) {
  if (col == undefined) {
    col = document.getElementById('col-dropdown').selectedIndex;
  }
  if (row == undefined) {
    row = document.getElementById('row-dropdown').selectedIndex;
  }
  document.getElementById('col-dropdown').selectedIndex = col;
  document.getElementById('row-dropdown').selectedIndex = row;
  localStorage.setItem('row', row);
  localStorage.setItem('col', col);
}

function UI_setAndStoreCardSize(size) {
  const dropdown = document.getElementById('size-dropdown');
  if (size == undefined) {
    size = parseInt(dropdown.value);
  }
  for (var i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].value == size.toString()) {
      dropdown.options[i].selected = true;
      break;
    }
  }
  localStorage.setItem('cardSize', size);
  UI_resizeCards();
}

function UI_resizeCards() {
  size = document.getElementById('size-dropdown').value;
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.width = `${size}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.height = `${size * 1.4}px`));
  document
    .querySelectorAll('.card')
    .forEach((e) => (e.style.borderRadius = `${size / 20}px`));

  // HTMLCollection can't use foreach
  ph = document.getElementsByClassName('placeholder');
  for (var i = 0, len = ph.length; i < len; i++) {
    ph[i].style.width = `${size}px`;
    ph[i].style.height = `${size * 1.4}px`;
    ph[i].style.borderRadius = `${size / 20}px`;
    ph[i].style.border = `${size / 15}px solid transparent`;
  }
}

function UI_populateBinderDropdown() {
  const select = document.getElementById('selectBinder');
  const bindernames = JSON.parse(localStorage.getItem('bindernames'));
  const defaultbinder = localStorage.getItem('bindername');
  select.innerHTML = '';
  for (binder of bindernames) {
    const option = document.createElement('option');
    if (binder != 'binder') {
      option.value = binder;
      option.textContent = binder;
    }
    if (binder == defaultbinder) {
      option.selected = 'selected';
    }
    select.appendChild(option);
  }
}

function UI_populateSetDropdown() {
  const select = document.getElementById('selectSet');
  const setnames = JSON.parse(localStorage.getItem('setnames'));
  const defaultset = localStorage.getItem('setname');
  select.innerHTML = '';
  for (const set of setnames) {
    const option = document.createElement('option');
    if (set != 'set') {
      option.value = set;
      option.textContent = set;
    }
    if (set == defaultset) {
      option.selected = 'selected';
    }
    select.appendChild(option);
  }
}

function UI_populateGridDropdowns() {
  const colSelect = document.getElementById('col-dropdown');
  const rowSelect = document.getElementById('row-dropdown');
  for (let i = 0; i < 13; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    colSelect.appendChild(option);
    option.selected = 0;
  }
  for (let i = 0; i < 13; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    rowSelect.appendChild(option);
  }
}

function UI_populateSizeDropdown() {
  const colSelect = document.getElementById('size-dropdown');
  for (let i = 1; i < 11; i++) {
    const option = document.createElement('option');
    option.value = i * 50;
    option.textContent = i * 50;
    colSelect.appendChild(option);
  }
  for (let i = 1; i < 20; i++) {
    const option = document.createElement('option');
    option.value = i * 10;
    option.textContent = i * 10;
    colSelect.appendChild(option);
  }
}

function UI_createProgressBar() {
  CONSTANTS_initialize();
  const span = document.getElementById('progress');
  const newBar = document.createElement('progress');
  const max = FILL_DATA.length;
  const caught = UI_countCaught();
  const ratio = document.createTextNode(`${caught}/${max} `);
  const percent = document.createTextNode(
    ` ${((caught / max) * 100).toFixed(2)}%`
  );
  const newspan = document.createElement('span');

  newBar.max = max;
  newBar.value = caught;
  newspan.id = 'progress';
  newspan.appendChild(ratio);
  newspan.appendChild(newBar);
  newspan.appendChild(percent);
  span.replaceWith(newspan);
}

function UI_countCaught() {
  filtered = FILL_DATA.filter((row) => row[CAUGHT_COL] == 'x');
  return filtered.length;
}

function UI_selectNewBinder(source) {
  localStorage.setItem('binder_or_set', 'binder');
  const select = document.getElementById('selectBinder');
  const bindername = select.options[select.selectedIndex].text;
  localStorage.setItem('bindername', bindername);
  if (source == 'fillpage') {
    PAGE_fillPage();
  }
  UI_createProgressBar();
  STORE_storeFileNames('binder', bindername);
}

function UI_selectNewSet(source) {
  localStorage.setItem('binder_or_set', 'set');
  const select = document.getElementById('selectSet');
  const setname = select.options[select.selectedIndex].text;
  localStorage.setItem('setname', setname);
  if (source == 'fillpage') {
    PAGE_fillPage();
  }
  UI_createProgressBar();
  STORE_storeFileNames('set', setname);
}
