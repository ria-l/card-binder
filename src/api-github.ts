import * as constants from './constants.js';
import * as create from './create.js';
import * as get from './get.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

export async function fetchGhJson(
  url: string
): Promise<types.GithubJson | undefined> {
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
  const response = await fetch(
    `https://api.github.com/repos/ria-l/card-binder/commits`
  );
  const data = await response.json();
  return data[0].sha;
}

