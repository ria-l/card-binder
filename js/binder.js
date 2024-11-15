/**
 * Creates tags from  and stores them in localstorage.
 *
 * @param {Array} values rows of data from the spreadsheet.
 */
const createTags = () => {
  getConstantsFromStorage();
  const imgWidth = localStorage.getItem('imgWidth');
  const tags = [];
  for (var i = 0; i < binderData.length; i++) {
    const dir = `img/${binderData[i][jset].toLowerCase()}`;
    const filename = binderData[i][jfilename];
    const pkmntype = binderData[i][jpkmntype];
    const cardtype = binderData[i][jcardtype];
    const cardsubtype = binderData[i][jcardsubtype];

    const style_width = `width:${imgWidth}px;`;
    // keeps cards that are a couple pixels off of standard size from breaking alignment
    const style_height = `height:${imgWidth * 1.4}px;`;
    const title = `'${filename} : ${pkmntype} : ${cardtype}'`;

    if (binderData[i][jcaught] == 'x') {
      // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
      tags.push(
        `<img src='${dir}/${filename}' title=${title} style='${style_width}${style_height}border-radius:${
          imgWidth / 20
        }px;' />zzz`
      );
    } else {
      // placeholder styles
      // note that there are a couple other styles in the css file

      let special;
      if (binderData[i][jcardtype] != 'basic') {
        special = cardTypeColors[cardtype].join(',');
      }

      let border_colors;
      const light = pkmnTypeColors[binderData[i][jpkmntype]][0];
      const dark = pkmnTypeColors[binderData[i][jpkmntype]][1];
      if (cardtype == 'basic') {
        border_colors = `${dark},${light},${dark},${light},${dark}`;
      } else {
        border_colors = `${dark},${light},white,${special}`;
      }

      let fill_colors;
      if (cardsubtype.includes('gold')) {
        fill_colors = `#fef081,#c69221,#fef081,white 25%,#f9f9f9,white,#f9f9f9`;
      } else {
        fill_colors = `#f9f9f9,white,#f9f9f9,white,#f9f9f9`;
      }

      const background_fill_style = `linear-gradient(to bottom right, ${fill_colors}) padding-box,`;
      const background_border_style = `linear-gradient(to bottom right, ${border_colors}) border-box;`;

      const style =
        `'` +
        style_width +
        `height:${imgWidth * 1.4}px;` +
        'background: ' +
        background_fill_style +
        background_border_style +
        `border-radius:${imgWidth / 20}px;` +
        `border: ${imgWidth / 15}px solid transparent;` +
        `'`;

      // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
      tags.push(
        `<span class='placeholder' title=${title} style=${style}></span>zzz`
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
  // puts binder names into a set
  const header = data[0];
  localStorage.setItem('header', header);
  const binderNames = new Set();
  const binderIndex = header.indexOf('binder');
  for (const row of data) {
    binderNames.add(row[binderIndex]);
  }

  // parses and stores binder data
  for (const name of binderNames) {
    // only the cards that are in the given binder
    filtered = data.filter((row) => row[binderIndex] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    if (name == 'illust') {
      toStore = sortByDex(filtered);
    } else {
      toStore = sortByColor(filtered);
    }
    localStorage.setItem(name, JSON.stringify(toStore));
  }
  localStorage.setItem('bindernames', JSON.stringify([...binderNames]));
};

/**
 * Fills binder using data in localstorage.
 */
const fillBinder = () => {
  const cardTags = localStorage.getItem('tags').split(/zzz,?/);
  let rows = parseInt(localStorage.getItem('row'));
  let cols = parseInt(localStorage.getItem('col'));
  let newContent = '';

  if (isNaN(rows)) {
    rows = 3;
  }
  if (isNaN(cols)) {
    cols = 3;
  }
  cardTags.forEach((tag, i) => {
    // don't create tables if grid is 0 or blank.
    if (rows == 0 || cols == 0) {
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
        fullTag += `<table>`;
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
  console.log('binder filled');
};
