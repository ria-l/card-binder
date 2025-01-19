import * as constants from './v2-constants.js';
import * as get from './v2-get.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

export function setRandomBg() {
  const bgSpan = utils.getElByIdOrThrow('bg-span');
  const x = Math.floor(Math.random() * constants.BG_FILES.length);
  bgSpan.style.setProperty(
    'background-image',
    `url('img/0_bg/${constants.BG_FILES[x]}')`
  );
}

export async function fillSetDropdown(): Promise<void> {
  const setMetadata = await get.getSetMetadata();
  const activeSet = await get.getActiveSet();

  const setDropdown = utils.getElByIdOrThrow('set-dropdown');
  if (setDropdown) setDropdown.innerHTML = '';
  for (let setId of Object.keys(setMetadata)) {
    const option = document.createElement('option');
    option.value = setId;
    option.textContent = setMetadata[setId]['name'];
    if (setId == activeSet) {
      option.selected = true;
    }
    setDropdown.appendChild(option);
  }
}

/**
 * generates hex string for gradient border
 * @param subtype basic, ex etc
 * @param energy
 * @param supertype pokemon, trainer, or energy
 * @returns
 */
export function generateBorderColors(
  subtype: string,
  energy: string,
  supertype: string
): string {
  // normalize the inputs
  subtype =
    subtype.toLowerCase() in constants.POKEMON_COLORS
      ? subtype.toLowerCase()
      : 'other';
  energy =
    energy.toLowerCase() in constants.ENERGY_COLORS
      ? energy.toLowerCase()
      : 'other';
  supertype =
    supertype.toLowerCase() in constants.SUPERTYPE_COLORS
      ? supertype.toLowerCase()
      : 'trainer';

  // generate gradients
  if (supertype === 'pokémon') {
    const left = _getColors(constants.ENERGY_COLORS, energy);
    const right = _getColors(constants.POKEMON_COLORS, subtype);
    return subtype == 'basic'
      ? _createGradient(left, left, left[1])
      : _createGradient(left, 'white', right);
  }
  if (supertype === 'trainer') {
    const left = _getColors(constants.TRAINER_COLORS, subtype);
    const right = _getColors(constants.SUPERTYPE_COLORS, supertype);
    return _createGradient(left, 'white', right);
  }
  if (supertype === 'energy') {
    const left = _getColors(constants.ENERGY_COLORS, energy);
    const right = _getColors(constants.SUPERTYPE_COLORS, supertype);
    return _createGradient(left, 'white', right);
  }
  throw new Error('no supertype for card');

  // helper functions
  function _getColors(colorMap: object, key: string) {
    return colorMap[key as keyof typeof colorMap];
  }
  function _createGradient(
    left: string[],
    middle: string | string[],
    right: string[]
  ) {
    return `${left},${middle},${right}`;
  }
}
