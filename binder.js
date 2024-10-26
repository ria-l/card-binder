// todo: split binders into storage
// todo: add binder name to page
// todo: add binder selection

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
