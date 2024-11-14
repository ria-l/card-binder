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
  // The maximum is exclusive and the minimum is inclusive.
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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
      localStorage.setItem('cards', JSON.stringify([...data]));
      console.log('cards stored');
    })
    .catch((error) => console.error('!!!!!!!!', error, header, index, column));
}

function addCardToList(filename, caught, dir) {
  const ol = document.getElementById('card-list');
  const li = document.createElement('li');
  const img = document.createElement('img');
  const div = document.getElementById('card-list-div');
  let textnode = filename;
  img.src = `${dir}/${filename}`;
  img.style.height = '100px';

  if (!caught) {
    textnode = `✨NEW✨${filename}`;
  } else {
    img.style.opacity = '50%';
  }
  div.insertBefore(img, ol);
  li.appendChild(document.createTextNode(textnode));
  ol.insertBefore(li, ol.firstChild);
}

const clearList = () => {
  const div = document.getElementById('card-list-div');
  div.innerHTML = '';
  div.innerHTML = '<ol reversed id="card-list"></ol>';
};

const fillLotto = (cardData) => {
  getConstantsFromStorage();

  const dir = `img/${cardData[0][jset].toLowerCase()}`;
  const filename = cardData[0][jfilename];
  const pkmntype = cardData[0][jpkmntype];
  const cardtype = cardData[0][jcardtype];
  const caught = cardData[0][jcaught];
  const title = `'${filename} : ${pkmntype} : ${cardtype}'`;

  document.getElementById('id-filename').value = filename;
  addCardToList(filename, caught, dir);
  document.getElementById('form').submit();

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

  document.getElementById('status').innerHTML = '';
};

window.onload = () => {
  if (localStorage.getItem('cards')) {
    console.log('already stored');
  } else {
    fetchFilenames();
  }
};
