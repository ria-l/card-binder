function PAGE_fillBinder() {
  const binderContent = PAGE_createBinderContent();
  document.getElementById('content').innerHTML = '';
  binderContent.forEach((item) => {
    document.getElementById('content').appendChild(item);
  });

  console.log('filled binder');
}

function PAGE_createBinderContent() {
  const cardTags = PAGE_createCardTags();
  const rows = parseInt(document.getElementById('row-dropdown').selectedIndex);

  const cols = parseInt(document.getElementById('col-dropdown').selectedIndex);

  const allTables = [];
  let currentTable;
  let currentRow;

  cardTags.forEach((tag, i) => {
    if (!rows || !cols) {
      allTables.push(tag);
      const spaceNode = document.createTextNode(' ');
      allTables.push(spaceNode);
    } else {
      // Use the remainder value from the modulo function to put each card into a row/grid bucket.
      const rowIndex = (i + 1) % cols;
      const gridIndex = (i + 1) % (rows * cols);

      const table = document.createElement('table');
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.appendChild(tag);

      // first card in grid
      if (gridIndex == 1) {
        currentTable = table;
      }

      // middle cards
      if (rowIndex == 1) {
        // first card in row
        currentRow = tr;
        currentRow.appendChild(td);
      } else if (rowIndex == 0) {
        // last card in row
        if (cols == 1) {
          currentRow = tr;
        }
        if (rows == 1) {
          currentTable = table;
        }
        currentRow.appendChild(td);
        currentTable.appendChild(currentRow);
      } else {
        currentRow.appendChild(td);
      }

      // last card in grid
      if (gridIndex == 0) {
        if (cols == 1) {
          currentRow = tr;
        }
        if (rows == 1) {
          currentTable = table;
        }
        allTables.push(currentTable);
        currentTable = null;
      }
      // Any cards that don't fit neatly into the grid
      if (currentTable) {
        currentTable.appendChild(currentRow);
        allTables.push(currentTable);
      }
    }
  });
  return allTables;
}

function PAGE_createCardTags() {
  CONSTANTS_initialize();
  const cardSize = document.getElementById('size-dropdown').value;
  const tags = [];
  for (var card = 0; card < BINDER_DATA.length; card++) {
    const dir = `img/${BINDER_DATA[card][SET_COL].toLowerCase()}`;
    const filename = BINDER_DATA[card][FILENAME_COL];
    const pkmntype = BINDER_DATA[card][PKMNTYPE_COL];
    const cardtype = BINDER_DATA[card][CARDTYPE_COL];
    const cardsubtype = BINDER_DATA[card][CARDSUBTYPE_COL];

    const title = `${filename} : ${pkmntype} : ${cardtype}`;
    if (BINDER_DATA[card][CAUGHT_COL] == 'x') {
      PAGE_generateImgTag(tags, dir, filename, title, cardSize);
    } else {
      PAGE_generatePlaceholder(
        card,
        cardtype,
        cardsubtype,
        cardSize,
        tags,
        title
      );
    }
  }
  console.log('created tags');
  return tags;
}

function PAGE_generateImgTag(tags, dir, filename, title, cardSize) {
  const img = document.createElement('img');
  img.src = `${dir}/${filename}`;
  img.title = title;
  img.style.width = `${cardSize}px`;
  img.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  img.style.borderRadius = `${cardSize / 20}px`;
  img.classList.add('card');

  tags.push(img);
}

function PAGE_generatePlaceholder(
  i,
  cardtype,
  cardsubtype,
  cardSize,
  tags,
  title
) {
  // note that there are a couple other styles in the css file

  const border_colors = PAGE_generateBorderColors(i, cardtype);
  let fill_colors;
  if (cardsubtype.includes('gold')) {
    fill_colors = `#fef081,#c69221,#fef081,white 25%,#f9f9f9,white,#f9f9f9`;
  } else {
    fill_colors = `#f9f9f9,white,#f9f9f9,white,#f9f9f9`;
  }

  const span = document.createElement('span');
  span.className = 'placeholder';
  span.title = title;
  span.style.width = `${cardSize}px`;
  span.style.height = `${cardSize * 1.4}px`; // keeps cards that are a couple pixels off of standard size from breaking alignment
  span.style.background = `linear-gradient(to bottom right, ${fill_colors}) padding-box, linear-gradient(to bottom right, ${border_colors}) border-box`;
  span.style.borderRadius = `${cardSize / 20}px`;
  span.style.border = `${cardSize / 15}px solid transparent`;

  tags.push(span);
}

function PAGE_generateBorderColors(picked_card_row, cardtype) {
  let special;
  if (BINDER_DATA[picked_card_row][CARDTYPE_COL] != 'basic') {
    special = CARD_HEX_COLORS[cardtype].join(',');
  }

  let border_colors;
  const light = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][0];
  const dark = PKMN_HEX_COLORS[BINDER_DATA[picked_card_row][PKMNTYPE_COL]][1];
  if (cardtype == 'basic') {
    border_colors = `${dark},${light},${dark},${light},${dark}`;
  } else {
    border_colors = `${dark},${light},white,${special}`;
  }
  return border_colors;
}
