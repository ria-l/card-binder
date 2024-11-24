import * as constants from './constants.js';
import * as sorting from './sorting.js';

export function storeData(data) {
  const header = data[0];
  localStorage.setItem('header', header);
  const binderName = storeCardData(header, data, 'binder');
  const setName = storeCardData(header, data, 'set');
  storeFileNames('binder', binderName);
  storeFileNames('set', setName);
}

function storeCardData(header, data, container) {
  let containerName = localStorage.getItem(`${container}name`);
  if (!containerName) {
    if (container == 'binder') {
      containerName = header[0]; // TODO: make this random
    } else if (container == 'set') {
      containerName = 'PAL'; // TODO: make this random
    }
    localStorage.setItem(`${container}name`, containerName);
  }
  // store container names
  const containerNames = new Set();
  const containerCol = header.indexOf(container);
  for (const row of data) {
    if (row[containerCol] != container) {
      containerNames.add(row[containerCol]);
    }
  }
  localStorage.setItem(
    `${container}names`,
    JSON.stringify([...containerNames])
  );
  // store data for each container
  for (const name of containerNames) {
    // only the cards that are in the given binder
    let filtered = data.filter((row) => row[containerCol] == name);
    // add back the header, since it would be removed during filtering
    filtered.unshift(header);
    localStorage.setItem(name, JSON.stringify(sorting.sortByColor(filtered)));
  }
  return containerName;
}

/**
 *
 * @param {string} container binder or set
 * @param {string} containerName name of binder or set
 */
export function storeFileNames(container, containerName) {
  const data = JSON.parse(localStorage.getItem(containerName));
  const filenames = data.map((row) => row[constants.FILENAME_COL]);
  localStorage.setItem(
    `${container}_filenames`,
    JSON.stringify([...filenames])
  );
}
