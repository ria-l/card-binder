/**
 * Updates the input fiels for the card size.
 *
 * @param {string} type absolute or relative change
 * @param {int} input card width in pixels
 */
const setInputForCardSize = (type, input) => {
  const w = document.getElementById('inputCardSize');
  type == 'relative'
    ? (w.value = (parseInt(w.value) + parseInt(input)).toString())
    : (w.value = input);
  localStorage.setItem('imgWidth', input);
};

/**
 * Updates cards with whatever value is in the input field.
 */
const setCardSize = () => {
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
};

/**
 * Sets inputs and then applies changes. Used by the UI buttons and initial fill.
 *
 * @param {string} type absolute or relative change
 * @param {int} input card width in pixels
 */
const resizeCards = (type, input) => {
  setInputForCardSize(type, input);
  setCardSize();
};

/**
 * Updates the input fields for the grid size.
 *
 * @param {string} type absolute or relative change
 * @param {int} col number of cols
 * @param {int} row number of rows
 */
const setInputsForGrid = (type, col, row) => {
  const r = document.getElementById('inputRow');
  const rowString =
    type == 'relative' ? (parseInt(r.value) + row).toString() : row.toString();
  r.value = rowString;
  localStorage.setItem('row', rowString);

  const c = document.getElementById('inputCol');
  const colString =
    type == 'relative' ? (parseInt(c.value) + col).toString() : col.toString();
  c.value = colString;
  localStorage.setItem('col', colString);
};

/**
 * Sets inputs and then applies changes.
 *
 * @param {string} type absolute or relative change
 * @param {int} col number of cols
 * @param {int} row number of rows
 */
const changeGrid = (type, col, row) => {
  setInputsForGrid(type, col, row);
  createTags();
  fillBinder();
};

const setGrid = () => {
  const r = document.getElementById('inputRow');
  const c = document.getElementById('inputCol');
  localStorage.setItem('row', r.value);
  localStorage.setItem('col', c.value);
  changeGrid('absolute', parseInt(c.value), parseInt(r.value));
};
