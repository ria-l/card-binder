/**
 * Updates the input fiels for the card size.
 *
 * @param {string} type absolute or relative change
 * @param {int} input card width in pixels
 */
function setInputForCardSize(type, input) {
  let sizeField = document.getElementById('inputCardSize');
  let newVal = input;

  if (type == 'relative') {
    newVal = parseInt(sizeField.value) + parseInt(input);
  }
  sizeField.value = newVal.toString();
  localStorage.setItem('imgWidth', newVal);
}

/**
 * Updates cards with whatever value is in the input field.
 */
function setCardSize() {
  w = document.getElementById('inputCardSize').value;
  document.querySelectorAll('img').forEach((e) => (e.style.width = `${w}px`));
  document
    .querySelectorAll('img')
    .forEach((e) => (e.style.height = `${w * 1.4}px`));

  ph = document.getElementsByClassName('placeholder');
  for (var i = 0, len = ph.length; i < len; i++) {
    ph[i].style['width'] = `${w}px`;
    ph[i].style['height'] = `${w * 1.4}px`;
    ph[i].style['border-radius'] = `${w / 20}px`;
    ph[i].style['border'] = `${w / 15}px solid transparent`;
  }
}

/**
 * Sets inputs and then applies changes. Used by the UI buttons and initial fill.
 *
 * @param {string} type absolute or relative change
 * @param {int} input card width in pixels
 */
function resizeCards(type, input) {
  setInputForCardSize(type, input);
  setCardSize();
}

/**
 * Updates the input fields for the grid size.
 *
 * @param {string} type absolute or relative change
 * @param {int} col number of cols
 * @param {int} row number of rows
 */
function setInputsForGrid(type, col, row) {
  const r = document.getElementById('inputRow');
  type == 'relative'
    ? (r.value = (parseInt(r.value) + row).toString())
    : (r.value = row.toString());
  localStorage.setItem('row', row);
  const c = document.getElementById('inputCol');
  type == 'relative'
    ? (c.value = (parseInt(c.value) + col).toString())
    : (c.value = col.toString());
  localStorage.setItem('col', col);
}

/**
 * Sets inputs and then applies changes.
 *
 * @param {string} type absolute or relative change
 * @param {int} col number of cols
 * @param {int} row number of rows
 */
function changeGrid(type, col, row) {
  setInputsForGrid(type, col, row);
  fillBinder();
}

function populateDropdown() {
  console.log('populate dropdown');
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
