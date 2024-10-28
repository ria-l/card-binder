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
};

/**
 * Updates cards with whatever value is in the input field.
 */
const setCardSize = () => {
  document
    .querySelectorAll('img')
    .forEach(
      (e) =>
        (e.style.width = `${document.getElementById('inputCardSize').value}px`)
    );
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
  type == 'relative'
    ? (r.value = (parseInt(r.value) + row).toString())
    : (r.value = row.toString());

  const c = document.getElementById('inputCol');
  type == 'relative'
    ? (c.value = (parseInt(c.value) + col).toString())
    : (c.value = col.toString());
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
  fillBinder();
};
