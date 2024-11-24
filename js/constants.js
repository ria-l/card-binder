export const APPSCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxRhMe2yJHsPQb1pS1Tl8Nt68iD8ptO36TvZiztSUaAg7K4uOn4zShQgn8w1NVAJpNsgg/exec';

export let CARDTYPE_COL,
  CAUGHT_COL,
  DEX_COL,
  FILENAME_COL,
  HEADER,
  PKMNTYPE_COL,
  SET_COL,
  VISUALS_COL;

export function initializeConsts() {
  HEADER = localStorage.getItem('header').split(','); // must be first
  CARDTYPE_COL = HEADER.indexOf('card type');
  CAUGHT_COL = HEADER.indexOf('caught');
  DEX_COL = HEADER.indexOf('dex #');
  FILENAME_COL = HEADER.indexOf('file name');
  PKMNTYPE_COL = HEADER.indexOf('pkmn type');
  SET_COL = HEADER.indexOf('set');
  VISUALS_COL = HEADER.indexOf('visuals');
}

export const PKMN_HEX_COLORS = {
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
  trainer: ['#eb028b', '#f14eae'], // hot pink
};

export const CARD_HEX_COLORS = {
  basic: [],
  ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
  gold: ['#fef081', '#c69221', '#fef081'], // gold
  gx: ['#00aeed', '#036697', '#00aeed'], // blue
  v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
  vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
  vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
  item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
  supporter: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
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

export const BG_FILES = [
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
