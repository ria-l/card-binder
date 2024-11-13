const url =
  'https://script.google.com/macros/s/AKfycbyaRyXFFKd-89QvMiyEg0TSxkuwZJ8Xt90lCFYqYszjTiGvYDn5OgFUBt31ALRsAYzykQ/exec';

const populateDatalists = (id, arr) => {
  let result = '';
  for (const item of arr) {
    result += `<option value="${item}">`;
  }
  document.getElementById(id).innerHTML = result;
};

const lotto = (n) => {
  // get eligible cards
  const cards = JSON.parse(localStorage.cards);
  // pick random number of them
  let tag = [];
  for (let index = 0; index < n; index++) {
    picked = getRandomInt(0, cards.length);
    // display
    tag.push(cards[picked]);
  }
  fillLotto(tag);
};

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function fetchFilenames() {
  document.getElementById('status').className = 'status';
  document.getElementById('status').innerHTML = 'loading...';
  console.log('fetching file names...');
  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      document.getElementById('status').className = 'hidestatus';

      const header = data[0];
      localStorage.setItem('header', header);
      const index = header.indexOf('file name');
      const column = data.map((row) => row[index]);
      column.shift();
      populateDatalists('filenames', column);
      console.log('list populated');

      localStorage.setItem('cards', JSON.stringify([...data]));
      console.log('cards stored');
    })
    .catch((error) => console.error('!!!!!!!!', error, header, index, column));
}

const fillLotto = (binderData) => {
  const header = localStorage.getItem('header').split(',');

  const jcaught = header.indexOf('caught');
  const jfilename = header.indexOf('file name');
  const jset = header.indexOf('set');
  const jcardtype = header.indexOf('card type');
  const jpkmntype = header.indexOf('pkmn type');
  const jcardsubtype = header.indexOf('card subtype');

  const imgWidth = 100;
  const tags = [];
  let newContent = '';

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

    // the 'zzz' is for easy splitting into an array later. the tag itself has commas so can't use them as delimiters.
    tags.push(
      `<img src='${dir}/${filename}' title=${title} style='${style_width}${style_height}' />zzz`
    );
  }
  localStorage.setItem('tags', tags);
  const cardTags = localStorage.getItem('tags').split(/zzz,?/);
  cardTags.forEach((tag, i) => {
    // don't create tables if grid is 0 or blank.

    newContent += ` ${tag} `;

    document.getElementById('content').innerHTML = newContent;
    document.getElementById('status').innerHTML = '';
  });
};

window.onload = () => {
  if (localStorage.getItem('cards')) {
    console.log('already stored');
  } else {
    fetchFilenames();
  }
};
