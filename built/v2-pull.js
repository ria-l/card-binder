import * as app from './v2-app.js';
import * as constants from './v2-constants.js';
import * as page from './v2-page.js';
import * as store from './v2-store.js';
import * as ui from './v2-ui.js';
window.onload = () => {
    ui.setBg();
    document.getElementById('form').action =
        constants.APPSCRIPT_URL;
    if (localStorage.getItem('storage_init') == 'SUCCESS' &&
        localStorage.getItem('storage_ver') == constants.STORAGE_VERSION) {
        initializePull();
    }
    else {
        localStorage.clear();
        fetchAndInitializePull();
    }
    setEventListeners();
};
/**
 * sets up UI elements for pull page
 */
function initializePull() {
    console.log('loading from storage');
    ui.generateBinderDropdown();
    ui.generateSetDropdown();
    const collectionType = localStorage.getItem('collection_type');
    if (collectionType == 'binder') {
        ui.highlightBinder();
    }
    else if (collectionType == 'set') {
        ui.highlightSet();
    }
    ui.createProgressBar();
    localStorage.setItem('storage_init', 'SUCCESS');
    localStorage.setItem('storage_ver', constants.STORAGE_VERSION);
}
/**
 * wrapper that fetches data and initializes page.
 *  TODO: get onload to work with async/await and get rid of this.

 */
async function fetchAndInitializePull() {
    const data = await app.fetchData();
    store.storeData(data['db-all']);
    initializePull();
}
/**
 * sets event listeners for navbar
 */
function setEventListeners() {
    document
        .getElementById('binderDropdown')
        ?.addEventListener('change', () => ui.selectNewBinder(false));
    document
        .getElementById('setDropdown')
        ?.addEventListener('change', () => ui.selectNewSet(false));
    document
        .getElementById('pullOneButton')
        ?.addEventListener('click', () => pullCards(1));
    document
        .getElementById('pullFiveButton')
        ?.addEventListener('click', () => pullCards(5));
    document
        .getElementById('pullTenButton')
        ?.addEventListener('click', () => pullCards(10));
    document
        .getElementById('clearDisplayButton')
        ?.addEventListener('click', clearDisplay);
    document
        .getElementById('syncButton')
        ?.addEventListener('click', fetchAndInitializePull);
    ui.addShowHideToggle('display-btn', 'display-dropdown');
}
/**
 * clears this session's pulled cards from display
 */
function clearDisplay() {
    const largeCardSpan = document.getElementById('largeCardSpan');
    const smallCardSpan = document.getElementById('smallCardSpan');
    const listSpan = document.getElementById('listSpan');
    if (largeCardSpan)
        largeCardSpan.innerHTML = '';
    if (smallCardSpan)
        smallCardSpan.innerHTML = '';
    const ol = document.createElement('ol');
    ol.id = 'cardList';
    ol.reversed = true;
    if (listSpan) {
        listSpan.innerHTML = '';
        listSpan.appendChild(ol);
    }
}
/**
 * does all the stuff to pull the card
 * TODO: can refactor this more
 * @param n number of cards to pull
 */
function pullCards(n) {
    const collectionType = localStorage.getItem('collection_type') ?? 'binder';
    const storageKey = collectionType === 'binder' ? 'active_binder' : 'active_set';
    const activeCollection = localStorage.getItem(storageKey);
    const data = activeCollection
        ? JSON.parse(localStorage.getItem(activeCollection) ?? '[]')
        : [];
    const cardPool = data.map((row) => constants.getCellValue('filename', row, null));
    const pulled = [];
    for (let i = 0; i < n; i++) {
        const x = Math.floor(Math.random() * cardPool.length);
        pulled.push(x);
    }
    processPulled(pulled, data);
}
/**
 *
 * @param pulled index numbers in the filenames array
 * @param data data for the current collection
 */
function processPulled(pulled, data) {
    const newCards = [];
    const currentPulls = [];
    pulled.forEach((card) => {
        const binderRow = data[card] ?? [];
        const { title, dir, filename, caught, borderColors } = getCardMetadata(binderRow);
        const small = generateImg('small', dir, filename, caught, borderColors);
        const smallCardSpan = document.getElementById('smallCardSpan');
        smallCardSpan?.insertBefore(small, smallCardSpan.firstChild);
        currentPulls.push(generateImg('large', dir, filename, caught, borderColors));
        if (!caught) {
            newCards.push(filename);
        }
        addToList(title);
    });
    displayLarge(currentPulls);
    if (newCards.length) {
        processNewCards(newCards);
    }
}
/**
 *
 * @param binderRow full row
 * @returns
 */
function getCardMetadata(binderRow) {
    const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
    const filename = constants.getCellValue('filename', binderRow, header);
    const caught = constants.getCellValue('caught', binderRow, header);
    const cardtype = constants.getCellValue('cardtype', binderRow, header);
    const energytype = constants.getCellValue('energytype', binderRow, header);
    const set = constants.getCellValue('set', binderRow, header);
    const visuals = constants.getCellValue('visuals', binderRow, header);
    const binder = constants.getCellValue('binder', binderRow, header);
    let title = `${filename} : ${visuals} : binder: ${binder}`;
    if (!caught) {
        title += ` ✨NEW✨`;
    }
    const borderColors = page.generateBorderColors(cardtype, energytype);
    const dir = `img/${set.toLowerCase()}`;
    return { title, dir, filename, caught, borderColors };
}
/**
 * generates img element for small or large cards on pull page
 * @param size 'large' or 'small'
 * @param dir
 * @param filename
 * @param caught
 * @param borderColors
 * @returns
 */
function generateImg(size, dir, filename, caught, borderColors) {
    const img = document.createElement('img');
    img.src = `${dir}/${filename}`;
    if (size == 'small') {
        img.classList.add('small-card');
        img.onclick = function () {
            displayLarge([generateImg('large', dir, filename, caught, borderColors)]);
        };
    }
    else if (size == 'large') {
        img.classList.add('large-card');
    }
    if (caught) {
        img.classList.add('caught');
    }
    img.style.setProperty('background', `linear-gradient(to bottom right, ${borderColors}) border-box`);
    return img;
}
/**
 * displays large cards for the current pull
 * @param imgs
 */
function displayLarge(imgs) {
    const largeCardSpan = document.getElementById('largeCardSpan');
    const newSpan = document.createElement('span');
    newSpan.id = 'largeCardSpan';
    imgs.forEach((img) => {
        newSpan.insertBefore(img, newSpan.firstChild);
    });
    largeCardSpan?.replaceWith(newSpan);
}
/**
 * displays titles of current pulls to the list
 * @param title
 */
function addToList(title) {
    const ol = document.getElementById('cardList');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(title));
    ol?.insertBefore(li, ol.firstChild);
}
/**
 * updates stored data and progress bar with new cards, then submits to gSheet
 * @param newCards array of filenames
 */
function processNewCards(newCards) {
    updateNewCardsInCache(newCards);
    ui.createProgressBar();
    document.getElementById('filenamesInput').value =
        JSON.stringify(newCards);
    document.getElementById('form').submit();
}
/**
 * updates stored data (handles both binders and sets)
 * @param newCards array of filenames
 */
function updateNewCardsInCache(newCards) {
    const activeBinder = localStorage.getItem('active_binder') ?? '';
    const binderData = JSON.parse(localStorage.getItem(activeBinder) ?? '[]');
    const header = JSON.parse(localStorage.getItem('data_header') ?? '[]');
    newCards.forEach((filename) => {
        for (let rowNum = 0; rowNum < binderData.length; rowNum++) {
            if (constants.getCellValue('filename', binderData[rowNum], header) ==
                filename) {
                binderData[rowNum][header.indexOf('caught')] = 'x';
                break;
            }
        }
        // each card may have a different set, so need to handle storage individually
        const matchResult = filename.match(/^[^\.]*/) ?? '';
        const setName = matchResult[0].toUpperCase();
        const setData = JSON.parse(localStorage.getItem(setName) ?? '');
        for (let rowNum = 0; rowNum < setData.length; rowNum++) {
            if (constants.getCellValue('filename', setData[rowNum], header) == filename) {
                setData[rowNum][header.indexOf('caught')] = 'x';
                localStorage.setItem(setName, JSON.stringify(setData));
                break;
            }
        }
    });
    // only set after all cards are updated
    localStorage.setItem(activeBinder, JSON.stringify(binderData));
}
//# sourceMappingURL=v2-pull.js.map