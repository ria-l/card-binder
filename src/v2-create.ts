import * as binder from './v2-binder.js';
import * as constants from './v2-constants.js';
import * as create from './v2-create.js';
import * as get from './v2-get.js';
import * as localbase from './v2-localbase.js';
import * as pull from './v2-pull-fn.js';
import * as sort from './v2-sort.js';
import * as store from './v2-store.js';
import * as tcg from './v2-api-tcg.js';
import * as types from './v2-types.js';
import * as ui from './v2-ui.js';
import * as utils from './v2-utils.js';

export async function createCardImgForPulls(
  card: types.Card,
  isOwned: boolean,
  borderColors: string,
  title: string,
  blobsObj: {
    card_id: string;
    blob64: string;
  }[],
  filePathsObj: { path: string }[]
) {
  const img = new Image();
  await get.getImgSrc(card, img, blobsObj, filePathsObj);

  img.title = title;
  if (isOwned) {
    img.classList.add('owned');
  }
  img.style.setProperty(
    'background',
    `linear-gradient(to bottom right, ${borderColors}) border-box`
  );
  return img;
}

export async function generateImgMetadata(card: types.Card) {
  const isOwned = await utils.isOwnedCard(card);
  let title = `${card.zRaw.name} : ${card.zRaw.rarity}${
    !isOwned ? ' ✨NEW✨' : ''
  }`;
  const borderColors = ui.generateBorderColors(
    card.subtype,
    card.energy,
    card.supertype
  );
  return { isOwned, title, borderColors };
}

export async function createCardImgForBinder(
  card: types.Card,
  borderColors: string,
  title: string,
  blobsObj: {
    card_id: string;
    blob64: string;
  }[],
  filePathsObj: { path: string }[]
): Promise<HTMLImageElement> {
  const width = get.getCardSize();
  const height = width * 1.4; // keeps cards that are a couple pixels off of standard size from breaking alignment

  const img = new Image(width, height);
  await get.getImgSrc(card, img, blobsObj, filePathsObj);
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

export async function createPlaceholderForBinder(
  borderColors: string,
  title: string,
  fillColors: string,
  card: types.Card
): Promise<HTMLSpanElement> {
  const width = get.getCardSize();
  const ph = document.createElement('span');
  ph.classList.add('placeholder');
  ph.title = title;
  ph.style.width = `${width}px`;
  ph.style.height = `${width * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  ph.style.background = `linear-gradient(to bottom right, ${fillColors}) padding-box, linear-gradient(to bottom right, ${borderColors}) border-box`;
  ph.style.setProperty('border-radius', `${width / 20}px`);
  ph.style.setProperty('border', `${width / 15}px solid transparent`);
  ph.style.setProperty('font-size', `${width / 10}px`);
  ph.innerHTML = `${card.zRaw.number}/${card.zRaw.set.printedTotal} (${card.zRaw.set.total})
  <br>${card.zRaw.name}
  <br>${card.zRaw.rarity}`;
  return ph;
}

export async function createCardsForActiveSetInBinder(): Promise<
  (HTMLImageElement | HTMLSpanElement)[]
> {
  const blobsObj = await localbase.db
    .collection(constants.STORAGE_KEYS.blobs)
    .get()
    .then((blobs: any) => {
      return blobs;
    });
  const filePathsObj = await localbase.db
    .collection(constants.STORAGE_KEYS.filePaths)
    .get()
    .then((blobs: any) => {
      return blobs;
    });

  const cardData: { id: string; cards: types.Card[] } =
    await get.getCardsForActiveSet();
  const tags = [];
  sort.sortBySetNum(cardData.cards);
  for (const card of cardData.cards) {
    const { isOwned, title, borderColors } = await create.generateImgMetadata(
      card
    );
    if (isOwned) {
      tags.push(
        await create.createCardImgForBinder(
          card,
          borderColors,
          title,
          blobsObj,
          filePathsObj
        )
      );
    } else {
      const fillColors = binder.generateFillColors(card);
      tags.push(
        await create.createPlaceholderForBinder(
          borderColors,
          title,
          fillColors,
          card
        )
      );
    }
  }
  return tags;
}

export function fillSizeDropdown() {
  const sizeDropdown = utils.getElByIdOrThrow(
    'size-dropdown'
  ) as HTMLSelectElement;

  if (sizeDropdown.options.length == 0) {
    for (let i = 1; i < 11; i++) {
      const option = document.createElement('option');
      option.value = (i * 50).toString();
      option.textContent = (i * 50).toString();
      sizeDropdown.appendChild(option);
    }
    for (let i = 1; i < 20; i++) {
      const option = document.createElement('option');
      option.value = (i * 10).toString();
      option.textContent = (i * 10).toString();
      sizeDropdown.appendChild(option);
    }
  }
  // sets value
  const cardSize = get.getCardSize();
  const option = Array.from(sizeDropdown.options).find(
    (option) => option.value === cardSize.toString()
  );
  if (option) {
    option.selected = true;
  }
}

export function fillGridDropdown() {
  const colDropdown = utils.getElByIdOrThrow(
    'col-dropdown'
  ) as HTMLSelectElement;
  const rowDropdown = utils.getElByIdOrThrow(
    'row-dropdown'
  ) as HTMLSelectElement;

  if (rowDropdown.options.length == 0) {
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      colDropdown.appendChild(option);
    }
    for (let i = 0; i < 13; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString();
      rowDropdown.appendChild(option);
    }
  }
  // sets new values
  let gridCol = get.getGridCol();
  let gridRow = get.getGridRow();
  colDropdown.selectedIndex = gridCol;
  rowDropdown.selectedIndex = gridRow;
}
