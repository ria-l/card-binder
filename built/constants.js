// TODO: move functions to utils?
export const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRhMe2yJHsPQb1pS1Tl8Nt68iD8ptO36TvZiztSUaAg7K4uOn4zShQgn8w1NVAJpNsgg/exec';
/**
 * Gets cell value for a given row and column
 * @param columnTitle just the title
 * @param row full row
 * @param header full header
 * @returns cell value
 */
export function getMetadatum(columnTitle, row, header) {
    if (!header) {
        header = localStorage.getItem('header').split(',');
    }
    let index = header.indexOf(_headerTextMap[columnTitle]);
    return row[index];
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
};
export const CARD_COLORS = {
    basic: [],
    ex: ['#60d8c6', '#009d82', '#60d8c6'], // teal
    gx: ['#00aeed', '#036697', '#00aeed'], // blue
    v: ['#4d4d4d', '#000000', '#4d4d4d'], // black & grey
    vmax: ['#fbcf4c', '#e61c75', '#3f3487'], // yellow & pink & purple
    vstar: ['#fde0ec', '#bad5ed', '#d2ece3'], // pink & teal & blue
    item: ['#54a1cc', '#0a78b6', '#54a1cc'], // blue
    supporter: ['#ffaf4d', '#ff8d00', '#ffaf4d'], // orange
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
};
/**
 *
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