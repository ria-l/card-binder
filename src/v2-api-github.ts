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

export async function fetchGhJson(
  url: string
): Promise<types.GithubTree | undefined> {
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
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function fetchAndStoreGh() {
  const data = await fetchGhJson(constants.GITHUB_TREE_URL);
  if (data) {
    store.storeGhImgPaths(data);
  }
}
