import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export function storeSetMetaData(data) {
    const sorted = sort.sortDataByReleaseDate(data);
    const setMetadata = sorted.reduce((acc, { id, name, series, releaseDate }) => {
        acc[id] = { name, series, releaseDate };
        return acc;
    }, {});
    localStorage.setItem(constants.STORAGE_KEYS.setMetadata, JSON.stringify(setMetadata));
    return setMetadata;
}
/**
 * updates storage to newly selected set.
 * @param fillpage whether the function is being called to fill the page or not
 */
export async function saveActiveSetAndCards() {
    const activeSet = get.getSelectedSet();
    if (!activeSet) {
        throw new Error('no set selected');
    }
    localStorage.setItem(constants.STORAGE_KEYS.activeSet, activeSet);
    const setData = await get.getSetMetadata();
    if (!setData[activeSet]['cards']) {
        await tcg.fetchAndStoreCardsBySet(activeSet);
    }
}
export async function storeCardsBySetId(setid, cards) {
    const setData = await get.getSetMetadata();
    // init if set is not in storage
    if (!setData[setid]) {
        setData[setid] = {};
    }
    setData[setid]['cards'] = cards;
    localStorage.setItem(constants.STORAGE_KEYS.setMetadata, JSON.stringify(setData));
}
//# sourceMappingURL=v2-store.js.map