// TODO: move functions to utils?
export const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzEm1_OapVddqbKmnd_mn6DRU5p7e_K4BVqtC7f-k6J7g9IrTIixCnpJsiGfZycq7H7fw/exec';
export const STORAGE_VERSION = '16:04:23';
/**
 * gets cell value for a given row and column
 * @param colName just the title
 * @param dataRow full row
 * @param header full header
 * @returns cell value
 */
export function getCellValue(colName, dataRow, header) {
    if (!header) {
        header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
    }
    const column = _headerTextMap[colName];
    const index = header.indexOf(column);
    return dataRow[index] ?? '';
}
const _headerTextMap = {
    cardtype: 'card type',
    caught: 'caught',
    dex: 'dex #',
    filename: 'file name',
    energytype: 'energy type',
    set: 'set',
    binder: 'binder',
    visuals: 'visuals',
    caughtdate: 'caught date',
};
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
    item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
    supporter: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
    missing: ['#00FF00', '#00FF00'],
    stadium: ['#45bf45', '#71c871'],
};
export const CARD_COLORS = {
    basic: [],
    ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
    gx: ['#00aeed', '#036697', '#00aeed'], // blue
    v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
    vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
    vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
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
    missing: ['#00FF00', '#00FF00'],
};
/**
 * generates fill gradient hex colors
 * @param visuals eg illust, full art
 * @param energytype eg grass, water
 * @returns hex codes for applicable gradient
 */
export function FILL_COLORS(visuals, energytype) {
    const energyColors = ENERGY_COLORS[energytype];
    const gradients = {
        normal: `#f9f9f9,white,#f9f9f9,white,#f9f9f9`,
        gold: '#fef081,#c69221,#fef081,#c69221,#fef081,#c69221',
        '3d': `${energyColors},${energyColors[0]},white 30%,#f9f9f9,white,#f9f9f9`,
        'full art': `${energyColors},${energyColors[0]},white 75%,#f9f9f9,white,#f9f9f9`,
        illust: `${energyColors},${energyColors},${energyColors}`,
        missing: '#00FFFF,#00FFFF',
    };
    return gradients[visuals];
}
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