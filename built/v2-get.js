// get data, and fetch/store it if not found
import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as localbase from './v2-localbase.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export async function getSetMetadata() {
    console.log('== getSetMetadata ==');
    localbase.db.config.debug = true;
    const data = await localbase.db
        .collection(constants.STORAGE_KEYS.setMetadata)
        .get()
        .then((sets) => {
        return sets;
    });
    if (!data || !data.length) {
        const data = await tcg.fetchJson('https://api.pokemontcg.io/v2/sets');
        return store.storeSetMetaData(data);
    }
    const sorted = sort.sortSetsByReleaseDate(data);
    return sorted;
}
export async function getSecret(key) {
    const secrets = await getSecrets();
    return secrets[key];
}
/**
 * Gets one of the following in preferential order: stored active set, selected set, random set.
 * We want the stored value first to preserve selection across pages/sessions.
 */
export async function getActiveSet() {
    let activeSet = localStorage.getItem(constants.STORAGE_KEYS.activeSet);
    if (!activeSet) {
        activeSet = getSelectedSet();
    }
    console.log('active set: ', activeSet);
    return activeSet ?? (await pickAndStoreRandomSet());
}
export function getSelectedSet() {
    const setDropdown = utils.getElByIdOrThrow('set-dropdown');
    const selectedSet = setDropdown.options[setDropdown.selectedIndex];
    if (selectedSet) {
        return selectedSet.value;
    }
    return '';
}
export async function pickAndStoreRandomSet() {
    const setData = await getSetMetadata();
    const setIds = setData.map((set) => {
        return set.id;
    });
    const i = Math.floor(Math.random() * setIds.length);
    localStorage.setItem(constants.STORAGE_KEYS.activeSet, setIds[i] ?? 'base1');
    return setIds[i] ?? 'base1';
}
export async function getCardMetadata() {
    localbase.db.config.debug = false;
    const data = await localbase.db
        .collection(constants.STORAGE_KEYS.cards)
        .get()
        .then((sets) => {
        return sets;
    });
    return data;
}
export function getEnergyType(card) {
    if (card.types && card.types.length && card.types[0]) {
        return card.types[0].toLowerCase();
    }
    else
        return '';
}
export function getDexNum(card) {
    if (card.nationalPokedexNumbers &&
        card.nationalPokedexNumbers.length &&
        card.nationalPokedexNumbers[0]) {
        return card.nationalPokedexNumbers[0];
    }
    else
        return card.nationalPokedexNumbers;
}
/**
 * only returns subtypes that are used for color matching in constants, otherwise return empty string.
 * @param card
 * @returns
 */
export function getSubtype(card) {
    if (!card.subtypes) {
        return '';
    }
    let subtype = '';
    if (card.supertype === 'Pokémon') {
        for (let type of card.subtypes) {
            if (type.toLowerCase() in constants.POKEMON_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
    if (card.supertype === 'Trainer') {
        for (let type of card.subtypes) {
            if (type.toLowerCase() in constants.TRAINER_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
    if (card.supertype === 'Energy') {
        for (let type of card.subtypes) {
            if (type.toLowerCase() in constants.ENERGY_COLORS) {
                subtype = type;
            }
        }
        return subtype.toLowerCase();
    }
}
export async function getCardsForActiveSet() {
    let cards;
    const activeSet = await getActiveSet();
    localbase.db.config.debug = false;
    try {
        cards = await localbase.db
            .collection(constants.STORAGE_KEYS.cards)
            .doc(activeSet)
            .get()
            .then((document) => {
            return document;
        });
    }
    finally {
        if (!cards || !Object.keys(cards).length) {
            cards = await store.storeCardsBySetId(activeSet);
        }
    }
    return cards;
}
// getvalues from api objects
export function getRarityType(card) {
    let gradientKey = 'a_normal';
    let rarity = card.zRaw.rarity ?? 'promo';
    for (const key in constants.RARITY_MAP) {
        if (constants.RARITY_MAP.hasOwnProperty(key)) {
            if (constants.RARITY_MAP[key] &&
                constants.RARITY_MAP[key].some((value) => value === rarity.toLowerCase())) {
                gradientKey = key;
            }
        }
    }
    return gradientKey;
}
export function getEnergyColors(card) {
    if (card.supertype.toLowerCase() === 'pokémon' ||
        card.supertype.toLowerCase() === 'energy') {
        let energy = card.energy.toLowerCase() in constants.ENERGY_COLORS
            ? card.energy.toLowerCase()
            : 'colorless';
        let energyColors = constants.ENERGY_COLORS[energy] ?? ['#00FFFF', '#00FFFF'];
        return energyColors;
    }
    if (card.supertype.toLowerCase() == 'trainer') {
        const subtype = get.getSubtype(card.zRaw)
            ? get.getSubtype(card.zRaw)?.toLowerCase()
            : 'item';
        let subtypeColors = constants.TRAINER_COLORS[subtype] ?? ['#00FFFF', '#00FFFF'];
        return subtypeColors;
    }
    return ['#00FFFF', '#00FFFF'];
}
export function getCardSize() {
    const dropdown = utils.getElByIdOrThrow('size-dropdown');
    const selected = dropdown.value;
    if (selected) {
        localStorage.setItem('card_size', selected);
        return parseInt(selected);
    }
    const stored = localStorage.getItem('card_size');
    if (stored) {
        return parseInt(stored);
    }
    localStorage.setItem('card_size', '120');
    return 120;
}
export function getGridCol() {
    const dropdown = utils.getElByIdOrThrow('col-dropdown');
    const selected = dropdown.selectedIndex;
    if (selected > -1) {
        localStorage.setItem('grid_col', selected.toString());
        return selected;
    }
    const stored = localStorage.getItem('grid_col');
    if (stored) {
        return parseInt(stored);
    }
    localStorage.setItem('grid_col', '0');
    return 0;
}
export function getGridRow() {
    const dropdown = utils.getElByIdOrThrow('row-dropdown');
    const selected = dropdown.selectedIndex;
    if (selected > -1) {
        localStorage.setItem('grid_row', selected.toString());
        return selected;
    }
    const stored = localStorage.getItem('grid_row');
    if (stored) {
        return parseInt(stored);
    }
    localStorage.setItem('grid_row', '0');
    return 0;
}
// TODO: wip
// async function getBinderCards() {
//   let cards: string[][] = []; // Initialize an empty array to store the matching documents
//   localbase.db
//     .collection('db-binders')
//     .get()
//     .then((data: object[]) => {
//       data.forEach((row: any) => {
//         if (row.pulled_date === 'classic') {
//           cards.push(row);
//         }
//       });
//       console.log('Cards array:', cards);
//     })
//     .catch((error: any) => {
//       console.error('Error getting documents: ', error);
//     });
// }
export async function getImgSrc(card, img, blobsObj, filePathsObj) {
    utils.toggleStatusModal(card.id, 'showstatus');
    const url = new URL(card.zRaw.images.large);
    const path = url.pathname.substring(1); // 'xy0/2_hires.png'
    const blobInStorage = await utils.blobInStorage(card, blobsObj);
    const pathInStorage = await utils.pathInStorage(card.zRaw.images.large, filePathsObj);
    // in file system
    if (pathInStorage) {
        img.src = `img/${path}`;
    }
    // in indexdb
    else if (blobInStorage) {
        img.src = blobInStorage;
    }
    // fetch and store
    else {
        const imgBlob = await tcg.fetchBlob(card.zRaw.images.large);
        const img64 = await utils.convertBlobToBase64(imgBlob);
        if (!img64) {
            throw new Error(`blob not converted: ${card.zRaw.images.large}`);
        }
        img.src = img64;
        await store.storeBlob(card, img64);
    }
}
//# sourceMappingURL=v2-get.js.map