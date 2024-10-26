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

/**
 * stores card data for each binder into its own bucket in local storage.
 *
 * @param {array} data data from sheets
 */
const storeBinders = (data) => {
  const header = data[0];
  const binderNames = new Set();
  const binderIndex = header.indexOf('binder');
  for (const row of data.slice(1)) {
    binderNames.add(row[binderIndex]);
  }
  for (const name of binderNames) {
    // filter only the card rows
    filtered = data.filter((row) => row[1] == name);
    // add back the header
    filtered.unshift(header);

    toStore = sortByColor(filtered);
    localStorage.setItem(name, JSON.stringify(toStore));
  }
  console.log(`stored binders for ${[...binderNames].join(', ')}`);
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
  console.log(`filled with ${binder} binder.`)
};
