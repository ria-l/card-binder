import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

export function sortSetsByReleaseDate(data: types.tcgSet[]) {
  return data.sort(
    (a, b) =>
      new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf()
  );
}

export const sortBySetNum = (data: types.Card[]): types.Card[] => {
  return data.sort((a, b) => {
    const numA = extractNumber(a.zRaw.number);
    const numB = extractNumber(b.zRaw.number);
    return numA - numB; // Ascending order
  });
};

function extractNumber(str: string) {
  const match = str.match(/(\d+)/); // Extracts the first sequence of digits
  return match ? parseInt(match[0], 10) : 0; // Default to 0 if no number is found
}
