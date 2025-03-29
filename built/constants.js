export const STORAGE_VERSION = '18:54:49';
export const CARDS_SETID_URL = 'https://api.pokemontcg.io/v2/cards?q=set.id:';
export const STORAGE_KEYS = {
    activeSet: 'v2_active_set',
    appscriptUrl: 'v2_appscript_url', // also in main
    cards: 'v2_cards',
    filePaths: 'v2_filepaths',
    owned: 'db-owned',
    rawSheetsData: 'v2_raw_sheets_data', // also in main
    secrets: 'v2_secrets', // also in main
    setMetadata: 'v2_set_metadata',
};
export const SECRETS_KEYS = {
    gapiAuthProvider: 'auth_provider_x509_cert_url',
    gapiAuthUri: 'auth_uri',
    gapiClientId: 'client_id',
    gapiClientSecret: 'client_secret',
    gapiJsOrigins: 'javascript_origins',
    gapiKey: 'gsheets_api_key',
    gapiTokenUri: 'token_uri',
    ghToken: 'github_token',
    ghProjectId: 'project_id',
    gsheetId: 'sheet_id',
    tcgapiKey: 'pkmn_api_key',
};
export const SHEET_NAMES = {
    owned: 'db-owned',
    cards: 'db-cards',
    binders: 'db-binders',
};
// left colors for pokemon and energy
export const ENERGY_COLORS = {
    colorless: ['#f5f4f0', '#d6d2cf'],
    darkness: ['#0d7080', '#0d3236'],
    dragon: ['#b0813a', '#acac42'],
    fairy: ['#e14690', '#b13870'],
    fighting: ['#ecab2a', '#d6713d'],
    fire: ['#f78b46', '#f2674b'],
    grass: ['#c2d349', '#93bb4e'],
    lightning: ['#fff023', '#ffd126'],
    metal: ['#c2e2f4', '#a6b3af'],
    psychic: ['#c992c0', '#9b6dad'],
    water: ['#93d9f5', '#11b6e6'],
};
// left colors for trainer
export const TRAINER_COLORS = {
    item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
    supporter: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
    stadium: ['#45bf45', '#71c871'],
};
// right colors for pokemon
export const POKEMON_COLORS = {
    basic: [],
    ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
    gx: ['#00aeed', '#036697', '#00aeed'], // blue
    v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
    vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
    vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
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
export const RARITY_MAP = {
    a_normal: ['common', 'uncommon', 'rare'],
    b_holo: [
        'ace spec rare',
        'amazing rare',
        'classic collection',
        'promo',
        'rare holo',
        'rare shiny',
        'shiny rare',
    ],
    c_extra: [
        'double rare',
        'legend',
        'radiant rare',
        'rare ace',
        'rare break',
        'rare holo ex',
        'rare holo gx',
        'rare holo lv.x',
        'rare holo star',
        'rare holo v',
        'rare holo vmax',
        'rare holo vstar',
        'rare prime',
        'rare prism star',
        'rare rainbow',
        'rare secret',
        'rare shining',
        'rare shiny gx',
        'rare ultra',
        'shiny ultra rare',
        'ultra rare',
    ],
    d_illust: [
        'illustration rare',
        'special illustration rare',
        'trainer gallery rare holo',
    ],
    gold: ['hyper rare'],
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
//# sourceMappingURL=constants.js.map