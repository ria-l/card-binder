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
    support: ['#fcceac', '#ff8d00'],
  };
  const cardTypeColors = {
    ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
    gold: ['#fef081', '#c69221', '#fef081'], // gold
    gx: ['#00aeed', '#036697', '#00aeed'], // blue
    support: ['#fcceac', '#ff8d00', '#fcceac'], // orange
    v: ['#636566', '#000000', '#636566'], // black & grey
    vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
    vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
    energy: ['#dbdddf', '#969a9d', '#dbdddf'], // silver
  };
  console.log('createtags: constants set');
  for (var i = 0; i < binderData.length; i++) {
    dir = `img/${binderData[i][jset].toLowerCase()}`;
    filename = binderData[i][jfilename];
    pkmntype = binderData[i][jpkmntype];
    cardtype = binderData[i][jcardtype];
    title = `'${filename} : ${pkmntype} : ${cardtype}'`;
    style_width = `width:${imgWidth}px;`;
    if (binderData[i][jcaught] == 'x') {
      // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
      tags.push(
        `<img src='${dir}/${filename}' title=${title} style='${style_width}' />zzz`
      );
    } else {
      light = pkmnTypeColors[binderData[i][jpkmntype]][0];
      dark = pkmnTypeColors[binderData[i][jpkmntype]][1];
      if (binderData[i][jcardtype] == 'basic') {
        color_tag = `${dark},${light},${dark}`;
      } else {
        special = cardTypeColors[binderData[i][jcardtype]].join(',');
        color_tag = `${dark},${light},#fff,${special}`;
      }

      // note that there are a couple other styles in the css file

      style_height = `height:${imgWidth * 1.4}px;`;
      _fill = `linear-gradient(to bottom right, #eee,white, #eee) padding-box,`;
      _border = `linear-gradient(to bottom right, ${color_tag}) border-box`;
      style_background = `background:${_fill} ${_border};`;
      style_borderradius = `border-radius:${imgWidth / 20}px;`;
      style_border = `border: ${imgWidth / 15}px solid transparent;`;
      style =
        `'` +
        style_width +
        style_height +
        style_background +
        style_borderradius +
        style_border +
        `'`;
      // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
      tags.push(
        `<div class='placeholder' title=${title} style=${style}></div>zzz`
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
