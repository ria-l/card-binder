import * as binder from './binder-fn.js';
import * as constants from './constants.js';
import * as create from './create.js';
import * as get from './get.js';
import * as localbase from './localbase.js';
import * as pull from './pull-fn.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

export async function createCardImgForBinder(
  card: types.Card,
  borderColors: string,
  title: string
): Promise<HTMLImageElement> {
  const width = get.getCardSize();
  const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment

  const img = new Image(width, height);
  img.src = card.zRaw.images.large;
  img.title = title;
  img.style.setProperty(
    'background',
    `linear-gradient(to bottom right, ${borderColors}) border-box`
  );
  img.style.setProperty('border-radius', `${width / 20}px`);
  img.classList.add('card');

  // add borders if toggle is checked
  if ((document.getElementById('toggle-borders') as HTMLInputElement).checked) {
    img.style.background = `linear-gradient(to bottom right, ${borderColors}) border-box`;
    img.style.setProperty('border', `${width / 15}px solid transparent`);
  }
  img.onclick = function () {
    ui.zoomCardInBinder(img);
  };
  return img;
}
