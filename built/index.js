// TODO: this whole module needs to be reorganized/split into other modules
import * as app from './app.js';
import * as page from './page.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as ui from './ui.js';
window.onload = () => {
    ui.setBg();
    ui.initializeGridAndSize();
    if (localStorage.getItem('page_status') == 'SUCCESS') {
        initializeIndex();
    }
    else {
        fetchAndInitializeIndex();
    }
    setEventListeners();
};
/**
 * loads all the visual elements for the index page
 */
function initializeIndex() {
    console.log('loading from storage');
    page.fillPage();
    ui.generateBinderDropdown();
    ui.generateSetDropdown();
    const container = localStorage.getItem('container');
    if (container == 'binder') {
        ui.highlightBinder();
    }
    else if (container == 'set') {
        ui.highlightSet();
    }
    ui.createProgressBar();
    localStorage.setItem('page_status', 'SUCCESS');
}
/**
 * wrapper method that fetches data and then loads UI
 */
async function fetchAndInitializeIndex() {
    const data = await app.fetchData();
    store.storeData(data.data);
    initializeIndex();
}
/**
 * adds event listeners to navbar elements
 */
function setEventListeners() {
    const binderDropdown = document.getElementById('binderDropdown');
    binderDropdown.addEventListener('change', function () {
        ui.selectNewBinder(true);
    });
    const setDropdown = document.getElementById('setDropdown');
    setDropdown.addEventListener('change', function () {
        ui.selectNewSet(true);
    });
    const colDropdown = document.getElementById('colDropdown');
    colDropdown.addEventListener('change', function () {
        ui.updateGrid();
    });
    const rowDropdown = document.getElementById('rowDropdown');
    rowDropdown.addEventListener('change', function () {
        ui.updateGrid();
    });
    const sizeDropdown = document.getElementById('sizeDropdown');
    sizeDropdown.addEventListener('change', function () {
        ui.resizeCards();
    });
    const sortDropdown = document.getElementById('sortDropdown');
    sortDropdown.addEventListener('change', function () {
        sort.newSort();
    });
    const syncButton = document.getElementById('syncButton');
    syncButton.addEventListener('click', function () {
        fetchAndInitializeIndex();
    });
    ui.addShowHideToggle('display-btn', 'display-dropdown');
    ui.addShowHideToggle('grid-btn', 'grid-dropdown');
    ui.addShowHideToggle('size-btn', 'size-dropdown');
    ui.addShowHideToggle('sort-btn', 'sort-dropdown');
    const borderCheckbox = document.getElementById('toggle-borders');
    borderCheckbox.addEventListener('change', function () {
        ui.toggleBorders();
    });
}
//# sourceMappingURL=index.js.map