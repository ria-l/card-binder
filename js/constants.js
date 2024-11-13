const appscript_url =
  'https://script.google.com/macros/s/AKfycbyaRyXFFKd-89QvMiyEg0TSxkuwZJ8Xt90lCFYqYszjTiGvYDn5OgFUBt31ALRsAYzykQ/exec';

let jcaught,
  jfilename,
  jset,
  jcardtype,
  jpkmntype,
  jcardsubtype,
  binderName,
  binderData;

const getConstantsFromStorage = () => {
  const header = localStorage.getItem('header').split(',');

  jcaught = header.indexOf('caught');
  jfilename = header.indexOf('file name');
  jset = header.indexOf('set');
  jcardtype = header.indexOf('card type');
  jpkmntype = header.indexOf('pkmn type');
  jcardsubtype = header.indexOf('card subtype');
  binderName = localStorage.getItem('bindername');
  binderData = JSON.parse(localStorage.getItem(binderName));
};

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