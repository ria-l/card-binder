import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export function sortDataByReleaseDate(data) {
    return data.sort((a, b) => new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf());
}
//# sourceMappingURL=v2-sort.js.map