// store data locally and return the stored value
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
/**
 * initial saving of just the set metadata without cards. this is triggered on fresh load or sync.
 */
export async function storeSetMetaData(data) {
    const sorted = sort.sortSetsByReleaseDate(data);
    const mapped = sorted.map((set) => {
        set['_key'] = set['id'];
        return set;
    });
    localbase.db.config.debug = false;
    await localbase.db
        .collection(constants.STORAGE_KEYS.setMetadata)
        .set(mapped, { keys: true });
    return mapped;
}
export function saveActiveSet() {
    const activeSet = get.getSelectedSet();
    if (!activeSet) {
        throw new Error('no set selected');
    }
    localStorage.setItem(constants.STORAGE_KEYS.activeSet, activeSet);
    return activeSet;
}
/**
 * stores just the cards for the given set
 * assumes they are not stored already; existence checks are in calling functions
 */
export async function storeCardsBySetId(setId) {
    const cardsForSet = await tcg.fetchCardsForSet(setId);
    const customizedCards = cardsForSet.map((row) => ({
        id: row.id,
        energy: get.getEnergyType(row),
        nationalDex: get.getDexNum(row),
        subtype: get.getSubtype(row),
        supertype: row.supertype ? row.supertype.toLowerCase() : '',
        zRaw: row,
    }));
    const toStore = { id: setId, cards: customizedCards };
    localbase.db.config.debug = false;
    await localbase.db.collection('v2_cards').add(toStore, setId);
    return toStore;
}
export async function storeGhImgPaths(data) {
    localbase.db.config.debug = false;
    for (const item of data.tree) {
        await localbase.db
            .collection(constants.STORAGE_KEYS.filePaths)
            .add({ path: item.path });
    }
}
//# sourceMappingURL=v2-store.js.map