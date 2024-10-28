/**
 * Creates tags from  and stores them in localstorage.
 *
 * @param {Array} values rows of data from the spreadsheet.
 */
const createTags = () => {
  const binderName = localStorage.getItem('bindername');
  const binderData = JSON.parse(localStorage.getItem(binderName));
  const header = JSON.parse(localStorage.getItem('binder'))[0];

  const jcaught = header.indexOf('caught');
  const jfilename = header.indexOf('file name');
  const jset = header.indexOf('set');
  const jcardtype = header.indexOf('card type');
  const jpkmntype = header.indexOf('pkmn type');

  const imgWidth = document.getElementById('inputCardSize').value;
  const tags = [];

  for (var i = 0; i < binderData.length; i++) {
    if (binderData[i][jcaught] == 'x') {
      tags.push(
        `<img src='img/${binderData[i][jset].toLowerCase()}/${
          binderData[i][jfilename]
        }' title='${binderData[i][jfilename]} : ${binderData[i][jpkmntype]} : ${
          binderData[i][jcardtype]
        }' style="width:${imgWidth}px;" />`
      );
    } else {
      tags.push(
        `<img src='img/sword_shield_promos/sword_shield_promos.SWSH146.poke_ball.png' title='${binderData[i][jfilename]} : ${binderData[i][jpkmntype]} : ${binderData[i][jcardtype]}' style="width:${imgWidth}px;" />`
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
  // loads binder names into var
  const header = data[0];
  localStorage.setItem('bindername', header[0]);
  const binderNames = new Set();
  const binderIndex = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }

  // parses and stores binder data
  for (const name of binderNames) {
    // filter only the card rows
    filtered = data.filter((row) => row[binderIndex] == name);
    // add back the header
    filtered.unshift(header);
    toStore = sortByColor(filtered);
    localStorage.setItem(name, JSON.stringify(toStore));
  }
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
};

/**
 * Fills binder using data in localstorage.
 */
const fillBinder = () => {
  createTags();

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
