const APPSCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxRhMe2yJHsPQb1pS1Tl8Nt68iD8ptO36TvZiztSUaAg7K4uOn4zShQgn8w1NVAJpNsgg/exec';

let CAUGHT_COL,
  FILENAME_COL,
  SET_COL,
  CARDTYPE_COL,
  PKMNTYPE_COL,
  CARDSUBTYPE_COL,
  BINDER_NAME,
  BINDER_DATA,
  SET_NAME,
  SET_DATA,
  FILL_DATA;

function CONSTANTS_initialize() {
  const header = localStorage.getItem('header').split(',');

  CAUGHT_COL = header.indexOf('caught');
  FILENAME_COL = header.indexOf('file name');
  SET_COL = header.indexOf('set');
  CARDTYPE_COL = header.indexOf('card type');
  PKMNTYPE_COL = header.indexOf('pkmn type');
  CARDSUBTYPE_COL = header.indexOf('card subtype');
  BINDER_NAME = localStorage.getItem('bindername');
  BINDER_DATA = JSON.parse(localStorage.getItem(BINDER_NAME));
  SET_NAME = localStorage.getItem('setname');
  SET_DATA = JSON.parse(localStorage.getItem(SET_NAME));
  BINDER_OR_SET = localStorage.getItem('binder_or_set');
  if (!BINDER_OR_SET || BINDER_OR_SET == 'binder') {
    FILL_DATA = BINDER_DATA;
  } else if (BINDER_OR_SET == 'set') {
    FILL_DATA = SET_DATA;
  }
}

const PKMN_HEX_COLORS = {
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

const CARD_HEX_COLORS = {
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

const BG_FILES = [
  'ace.jpeg',
  'electric.jpeg',
  'ground.jpg',
  'poison.jpg',
  'trans.jpeg',
  'applin.jpg',
  'fairy.jpg',
  'ice.jpg',
  'poli.jpg',
  'water.jpeg',
  'bi.jpeg',
  'fall.jpeg',
  'les.jpeg',
  'pride.jpeg',
  'wooloo.jpeg',
  'bug.jpg',
  'fighting.jpg',
  'minior.jpg',
  'psychic.jpg',
  'wooper.jpg',
  'chomp.jpeg',
  'fire.jpeg',
  'munchlax.jpg',
  'rock.jpg',
  'xmas.jpeg',
  'dark.jpg',
  'flying.jpg',
  'nb.jpeg',
  'shuckle.jpg',
  'dragon.jpg',
  'goomy.jpg',
  'normal.jpg',
  'steel.jpg',
  'eevee.jpg',
  'grass.jpeg',
  'pink.jpeg',
  'teal.jpeg',
];
