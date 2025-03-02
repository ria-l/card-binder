import * as constants from './v2-constants.js';
import * as create from './v2-create.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';
export async function fetchGhJson(url) {
    try {
        console.log(`Fetching ${url}`);
        const response = await fetch(url, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
    return undefined;
}
export async function fetchAndStoreGh() {
    console.log('== fetchAndStoreGh ==');
    const commitSha = await getLatestCommitSha();
    const treeUrl = `https://api.github.com/repos/ria-l/card-binder/git/trees/${commitSha}?recursive=1`;
    const data = await fetchGhJson(treeUrl);
    if (data) {
        store.storeGhImgPaths(data);
    }
}
export async function getLatestCommitSha() {
    console.log('== getLatestCommitSha ==');
    const response = await fetch(`https://api.github.com/repos/ria-l/card-binder/commits`);
    const data = await response.json();
    return data[0].sha;
}
//# sourceMappingURL=v2-api-github.js.map