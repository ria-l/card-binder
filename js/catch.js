const populateDatalists = (id, arr) => {
  let result = '';
  for (const item of arr) {
    result += `<option value="${item}">`;
  }
  document.getElementById(id).innerHTML = result;
};

const lotto = () => {
  const all = JSON.parse(localStorage.cards);
  let picked = [];
  x = getRandomInt(0, all.length);
  picked.push(all[x]);
  fillLotto(picked);
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
  fetch(appscript_url)
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

const fillLotto = (cardData) => {
  getConstantsFromStorage();

  const dir = `img/${cardData[0][jset].toLowerCase()}`;
  const filename = cardData[0][jfilename];
  const pkmntype = cardData[0][jpkmntype];
  const cardtype = cardData[0][jcardtype];

  const title = `'${filename} : ${pkmntype} : ${cardtype}'`;

  let special;
  if (cardData[0][jcardtype] != 'basic') {
    special = cardTypeColors[cardtype].join(',');
  }

  let border_colors;
  const light = pkmnTypeColors[cardData[0][jpkmntype]][0];
  const dark = pkmnTypeColors[cardData[0][jpkmntype]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }

  const newContent = `<img src='${dir}/${filename}' title=${title} style='height:500px;border-radius:15px' />`;
  document.getElementById('content').innerHTML = newContent;

  const backgroundStyle = `linear-gradient(to bottom right, ${border_colors}) border-box`;
  document.getElementsByTagName('body')[0].style.background = backgroundStyle;
  document.getElementsByTagName('body')[0].style.backgroundRepeat = 'no-repeat';
  document.getElementsByTagName('body')[0].style.minHeight = '100vh';

  document.getElementById('content').style.border = '10px solid transparent';

  document.getElementById('status').innerHTML = '';
};

window.onload = () => {
  if (localStorage.getItem('cards')) {
    console.log('already stored');
  } else {
    fetchFilenames();
  }
};
