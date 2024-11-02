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
  const jcardsubtype = header.indexOf('card subtype');

  const imgWidth = document.getElementById('inputCardSize').value;
  const tags = [];
  const pkmnTypeColors = {
    grass: ['#c2d349', '#93bb4e'],
    fire: ['#f78b46', '#f2674b'],
    water: ['#93d9f5', '#11b6e6'],
    lightning: ['#fff023', '#ffd126'],
    psychic: ['#c992c0', '#9b6dad'],
    fighting: ['#ecab2a', '#d6713d'],
    dark: ['#0d7080', '#0d3236'],
    metal: ['#c2e2f4', '#a6b3af'],
    fairy: ['#e14690', '#b13870'],
    dragon: ['#b0813a', '#acac42'],
    colorless: ['#f5f4f0', '#d6d2cf'],
    support: ['#eb028b', '#f14eae'], // hot pink
  };
  const cardTypeColors = {
    basic: [],
    ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
    gold: ['#fef081', '#c69221', '#fef081'], // gold
    gx: ['#00aeed', '#036697', '#00aeed'], // blue
    v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
    vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
    vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
    item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
    trainer: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
    energy: [
      '#f78b46', // fire
      '#ecab2a', // fighting
      '#fff023', // lightning
      '#c2d349', // grass
      '#93d9f5', // water
      '#0d7080', // dark
      '#c992c0', // psychic
      '#f5f4f0', // colorless
    ],
  };
  console.log('createtags: constants set');
  for (var i = 0; i < binderData.length; i++) {
    const dir = `img/${binderData[i][jset].toLowerCase()}`;
    const filename = binderData[i][jfilename];
    const pkmntype = binderData[i][jpkmntype];
    const cardtype = binderData[i][jcardtype];
    const cardsubtype = binderData[i][jcardsubtype];

    const style_width = `width:${imgWidth}px;`;
    const title = `'${filename} : ${pkmntype} : ${cardtype}'`;

    if (binderData[i][jcaught] == 'x') {
      // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
      tags.push(
        `<img src='${dir}/${filename}' title=${title} style='${style_width}' />zzz`
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
};
