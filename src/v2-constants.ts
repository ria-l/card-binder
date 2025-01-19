export const STORAGE_VERSION = '18:54:49';

export const CARDS_SETID_URL = 'https://api.pokemontcg.io/v2/cards?q=set.id:';

export const STORAGE_KEYS = {
  activeSet: 'v2_active_set',
  secrets: 'v2_secrets', // also in main
  appscriptUrl: 'v2_appscript_url', // also in main
  rawSheetsData: 'v2_raw_sheets_data', // also in main
  setMetadata: 'v2_set_metadata',
  owned: 'v2_owned',
};

// left colors for pokemon and energy
export const ENERGY_COLORS = {
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
};

// left colors for trainer
export const TRAINER_COLORS = {
  item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
  supporter: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
  stadium: ['#45bf45', '#71c871'],
  other: ['#00FF00', '#00FF00'],
};

// right colors for pokemon
export const POKEMON_COLORS = {
  basic: [],
  ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
  gx: ['#00aeed', '#036697', '#00aeed'], // blue
  v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
  vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
  vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
  other: ['#00FF00', '#00FF00'],
};

// right colors for trainer and energy
export const SUPERTYPE_COLORS = {
  trainer: ['#808186', '#696569'], // gray
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
  pokémon: [],
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
