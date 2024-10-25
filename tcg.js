// todo: split binders into storage
// todo: add binder name to page
// todo: add binder selection

const url =
  'https://script.google.com/macros/s/AKfycbzGqHn7b4NNZ_X5-PNBxjnLSnajFJb75rMt0yTBUEm9BMsSz2FMeb93OtNSV6ivgX6shw/exec';
let colInputObj = document.getElementById('inputCol');
let rowInputObj = document.getElementById('inputRow');
let sizeInputObj = document.getElementById('inputImgWidth');
let index;
localStorage.clear();
console.log('cleared storage');

const sortMatrix = (a, b) => {
  if (a[index] === b[index]) {
    return 0;
  } else {
    return a[index] < b[index] ? -1 : 1;
  }
};

const sortByColor = (raw) => {
  header = raw[0];
  unsorted = raw.slice(1);

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

const createTags = (values) => {
  const imgWidth = document.getElementById('inputImgWidth').value;
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

const fetchData = () => {
  console.log('fetching...');
  document.getElementById('status').innerHTML = 'loading...';

  fetch(url)
    .then((response) => response.json())
    .then(({ data }) => {
      console.log(`fetched`);
      // get the column names
      headers = data[0];
      // filter only the card rows
      shinies = data.filter((row) => row[1] == 'shiny');
      // add back the headers
      shinies.unshift(headers);
      toStore = sortByColor(shinies);
      localStorage.setItem('data', JSON.stringify(toStore));
      createTags(toStore);
    })
    .then(() => {
      fillBinder();
    })
    .catch((error) => (document.getElementById('content').innerHTML = error));
};

const fillBinder = () => {
  let newContent = '';
  const storedData = JSON.parse(localStorage.data);
  createTags(storedData);
  const cards = localStorage.tags.split(',');
  const rows = parseInt(rowInputObj.value);
  const cols = parseInt(colInputObj.value);

  cards.forEach((v, i) => {
    if (!rows || !cols) {
      newContent += ` ${v} `;
    } else {
      const rowIndex = (i + 1) % cols;
      const pageIndex = (i + 1) % (rows * cols);
      const tdTag = `<td>${v}</td>`;
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

const applyImgWidth = () => {
  document
    .querySelectorAll('img')
    .forEach(
      (e) =>
        (e.style.width = `${document.getElementById('inputImgWidth').value}px`)
    );
};

const changeImgWidth = (type, input) => {
  const w = document.getElementById('inputImgWidth');

  if (type == 'delta') {
    const wInt = parseInt(w.value) + parseInt(input);
    w.value = wInt.toString();
  } else {
    w.value = input;
  }
  applyImgWidth();
};

const changePageSize = (type, col, row) => {
  const r = document.getElementById('inputRow');
  const c = document.getElementById('inputCol');

  if (type == 'delta') {
    const rInt = parseInt(r.value) + row;
    const cInt = parseInt(c.value) + col;
    r.value = rInt.toString();
    c.value = cInt.toString();
  } else {
    r.value = row.toString();
    c.value = col.toString();
  }
};

window.onload = function () {
  document.getElementById('content').action = url;
  colInputObj = document.getElementById('inputCol');
  rowInputObj = document.getElementById('inputRow');
  sizeInputObj = document.getElementById('inputImgWidth');

  if (!sizeInputObj.value) {
    changeImgWidth('absolute', 50);
  }
  if (!colInputObj.value || !rowInputObj.value) {
    changePageSize('absolute', 8, 4);
  }
  fetchData();
};
