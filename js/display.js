function setAndStoreGrid(type, col, row) {
  let rowField = document.getElementById('inputRow');
  let newRowVal = row;
  if (type == 'relative') {
    newRowVal = parseInt(rowField.value) + parseInt(row);
  }
  rowField.value = newRowVal.toString();
  localStorage.setItem('row', newRowVal);

  let colField = document.getElementById('inputCol');
  let newColVal = col;
  if (type == 'relative') {
    newColVal = parseInt(colField.value) + parseInt(col);
  }
  colField.value = newColVal.toString();
  localStorage.setItem('col', newColVal);
  fillBinder();
}

function setAndStoreCardSize(type, input) {
  let sizeField = document.getElementById('inputCardSize');
  let newVal = input;

  if (type == 'relative') {
    newVal = parseInt(sizeField.value) + parseInt(input);
  }
  sizeField.value = newVal.toString();
  localStorage.setItem('imgWidth', newVal);

  _resizeCards();
}

function _resizeCards() {
  size = document.getElementById('inputCardSize').value;
  document
    .querySelectorAll('img')
    .forEach((e) => (e.style.width = `${size}px`));
  document
    .querySelectorAll('img')
    .forEach((e) => (e.style.height = `${size * 1.4}px`));

  // HTMLCollection can't use foreach
  ph = document.getElementsByClassName('placeholder');
  for (var i = 0, len = ph.length; i < len; i++) {
    ph[i].style.width = `${size}px`;
    ph[i].style.height = `${size * 1.4}px`;
    ph[i].style.borderRadius = `${size / 20}px`;
    ph[i].style.border = `${size / 15}px solid transparent`;
  }
}

function populateDropdown() {
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
  console.log('populated dropdown');
}
