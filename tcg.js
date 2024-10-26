// todo: split binders into storage
// todo: add binder name to page
// todo: add binder selection

const url =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let index;
localStorage.clear();
console.log('cleared storage');

// Sorting

const sortMatrix = (a, b) => {
  if (a[index] === b[index]) {
    return 0;
  } else {
    return a[index] < b[index] ? -1 : 1;
  }
};

const sortByColor = (data) => {
  header = data[0];
  unsorted = data.slice(1);

  index = header.indexOf('card #');
  byCardNum = unsorted.sort(sortMatrix);

  index = header.indexOf('release date');
  byRelease = byCardNum.sort(sortMatrix);

  index = header.indexOf('dex #');
  byDex = byRelease.sort(sortMatrix);

  index = header.indexOf('pkmn type #');
  byPkmnType = byDex.sort(sortMatrix);

  index = header.indexOf('card type #');
  byCardType = byPkmnType.sort(sortMatrix);

  return byCardType;
};

// Code generating

/**
 * Creates tags from  and stores them in localstorage.
 *
 * @param {Array} values rows of data from the spreadsheet.
 */
const createTags = (values) => {
  const imgWidth = document.getElementById('inputCardSize').value;
  tags = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][3] == 'x') {
      tags.push(
        `<img src='img/${values[i][5].toLowerCase()}/${values[i][0]}' title='${
          values[i][0]
        } : ${values[i][7]} : ${values[i][6]}' style="width:${imgWidth}px;" />`
      );
    } else {
      tags.push(
        `<img src='img/sword_shield_promos/sword_shield_promos.SWSH146.poke_ball.png' title='${values[i][0]} : ${values[i][7]} : ${values[i][6]}' style="width:${imgWidth}px;" />`
      );
    }
  }
  localStorage.setItem('tags', tags);
};

const storeBinders = (data) => {
  const cols = data[0];
  const binderNames = new Set();
  const binderIndex = cols.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }
  for (const binder of binderNames) {
    // filter only the card rows
    filtered = data.filter((row) => row[1] == binder);
    filtered.unshift(cols);

    toStore = sortByColor(filtered);
    localStorage.setItem(binder, JSON.stringify(toStore));
  }
  console.log(`stored ${[...binderNames].join(' ')}`);
};

/**
 * Fills binder using data in localstorage.
 *
 * @param {string} binder binder name
 */
const fillBinder = (binder) => {
  createTags(JSON.parse(localStorage.getItem(binder)));

  const cardTags = localStorage.getItem('tags').split(',');
  const rows = parseInt(document.getElementById('inputRow').value);
  const cols = parseInt(document.getElementById('inputCol').value);
  let newContent = '';

  cardTags.forEach((tag, i) => {
    // don't create tables if grid is 0 or blank.
    if (!rows || !cols) {
      newContent += ` ${tag} `;
    } else {
      // make the tables.
      // this is putting each card into a row/col bucket by using
      // the remainder value from the modulo function as a numbering system.
      const rowIndex = (i + 1) % cols;
      const pageIndex = (i + 1) % (rows * cols);
      const tdTag = `<td>${tag}</td>`;
      let fullTag = '';
      if (pageIndex == 1) {
        // first card on page
        fullTag += `<table style="float:left;padding:10px;">`;
      }
      if (rowIndex == 1) {
        // first card in row
        fullTag += `<tr>${tdTag}`;
      } else if (rowIndex == 0) {
        // last card in row
        fullTag += `${tdTag}</tr>`;
      } else {
        // middle card
        fullTag += `${tdTag}`;
      }
      if (pageIndex == 0) {
        // last card on page
        fullTag += '</table>';
      }
      newContent += fullTag;
    }
  });

  document.getElementById('content').innerHTML = newContent;
  document.getElementById('status').innerHTML = '';
};

/**
 * Initial data fetch and binder fill.
 */
const fetchAndFillBinder = () => {
  document.getElementById('status').innerHTML = 'loading...';

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      // get the column names
      header = data[0];
      // filter only the card rows
      shinies = data.filter((row) => row[1] == 'shiny');
      // add back the header
      shinies.unshift(header);
      toStore = sortByColor(shinies);
      localStorage.setItem('data', JSON.stringify(toStore));
      createTags(toStore);
    })
    .then(() => {
      fillBinder('data');
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

// Display

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
  fillBinder('data');
};

/**
 * main!
 */
window.onload = () => {
  document.getElementById('content').action = url;
  resizeCards('absolute', 50);
  setInputsForGrid('absolute', 8, 4);
  fetchAndFillBinder();
};
