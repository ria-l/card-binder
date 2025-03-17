// store data locally and return the stored value

import * as constants from './constants.js';
import * as get from './get.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

declare class Localbase {
  dbName: string | 'db';
  config: { debug: boolean };
  collection: Function;
  constructor(dbName?: string);
}

/**
 * initial saving of just the set metadata without cards. this is triggered on fresh load or sync.
 */
export async function storeSetMetaData(
  data: types.tcgSet[]
): Promise<types.tcgSet[]> {
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
export async function storeCardsBySetId(setId: string): Promise<{
  id: string;
  cards: types.Card[];
}> {
  const cardsForSet: any = await tcg.fetchCardsForSet(setId);

  const customizedCards: types.Card[] = cardsForSet.map(
    (row: types.tcgCard) => ({
      id: row.id,
      energy: get.getEnergyType(row),
      nationalDex: get.getDexNum(row),
      subtype: get.getSubtype(row),
      supertype: row.supertype ? row.supertype.toLowerCase() : '',
      zRaw: row,
    })
  );
  const toStore = { id: setId, cards: customizedCards };
  localbase.db.config.debug = false;
  await localbase.db
    .collection(constants.STORAGE_KEYS.cards)
    .add(toStore, setId);
  return toStore;
}

export async function storeGhImgPaths(data: types.GithubJson): Promise<void> {
  console.log('== storeGhImgPaths ==');
  const db = new Localbase('db'); // bugs out if not using a new instance for some reason and importing doesn't work 🤷🏻‍♀️
  db.config.debug = false;
  const mapped = data.tree
    .filter((tree) => tree.path.includes('img'))
    .map((tree) => {
      tree['_key'] = utils.extractDirAndFilenameWithoutExt(tree.path);
      return tree;
    });

  await db
    .collection(constants.STORAGE_KEYS.filePaths)
    .set(mapped, { keys: true });
}

export async function storeBlob(
  card: types.Card,
  blob64: string
): Promise<void> {
  localbase.db.config.debug = false;

  await localbase.db
    .collection(constants.STORAGE_KEYS.blobs)
    .add({ card_id: card.id, blob64: blob64 }, card.id);
}
