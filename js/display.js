function setAndStoreGrid(col, row) {
  console.log(col, row);
  if (col == undefined) {
    col = parseInt(document.getElementById('col-dropdown').selectedIndex);
  }
  if (row == undefined) {
    row = parseInt(document.getElementById('row-dropdown').selectedIndex);
  }
  document.getElementById('col-dropdown').selectedIndex = col;
  document.getElementById('row-dropdown').selectedIndex = row;
  localStorage.setItem('row', row);
  localStorage.setItem('col', col);
  fillBinder();
}

function setAndStoreCardSize(type, input) {
  let sizeField = document.getElementById('inputCardSize');
  let newSize = input;

  if (type == 'relative') {
    newSize = parseInt(sizeField.value) + parseInt(input);
  }
  sizeField.value = newSize.toString();
  localStorage.setItem('cardSize', newSize);

  _resizeCards();
}

function _resizeCards() {
  size = document.getElementById('inputCardSize').value;
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

function populateBinderDropdown() {
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
  console.log('populated binder dropdown');
}

function populateGridDropdowns() {
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
  console.log('populated grid size dropdown');
}

function generateBorderColors(picked_card_row, cardtype) {
  let special;
  if (BINDER_DATA[picked_card_row][CARDTYPE_COL] != 'basic') {
    special = CARD_HEX_COLORS[cardtype].join(',');
  }

  let border_colors;
  const light = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][0];
  const dark = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }
  return border_colors;
}

function createProgressBar() {
  getConstantsFromStorage();
  const span = document.getElementById('progress');
  const newBar = document.createElement('progress');
  const max = BINDER_DATA.length;
  const caught = _countCaught();
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

function _countCaught() {
  filtered = BINDER_DATA.filter((row) => row[CAUGHT_COL] == 'x');
  return filtered.length;
}
