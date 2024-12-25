import * as api_clients from './api_clients.js';
import * as constants from './constants.js';
import * as page from './page.js';
import * as sort from './sort.js';
import * as store from './store.js';
import * as ui from './ui.js';
window.onload = () => {
    loadPage();
};
async function loadPage() {
    if (localStorage.getItem('storage_init') !== 'SUCCESS' ||
        localStorage.getItem('storage_ver') !== constants.STORAGE_VERSION) {
        const gSheetsData = await api_clients.fetchGSheetsData();
        const tcgSetsData = await api_clients.fetchTcgSets();
        store.storeData(gSheetsData, tcgSetsData);
    }
    setEventListeners();
    ui.initPageUi();
    // card display
    ui.initializeGridAndSize();
    const collectionType = localStorage.getItem('collection_type');
    if (collectionType == 'binder') {
        ui.highlightBinder();
    }
    else if (collectionType == 'set') {
        ui.highlightSet();
    }
    page.fillPage();
    store.logSuccess();
}
/**
 * adds event listeners to navbar elements
 */
function setEventListeners() {
    document
        .getElementById('binderDropdown')
        ?.addEventListener('change', () => ui.selectNewBinder(true));
    document
        .getElementById('set-dropdown')
        ?.addEventListener('change', () => ui.selectNewSet(true));
    document
        .getElementById('colDropdown')
        ?.addEventListener('change', ui.updateGrid);
    document
        .getElementById('rowDropdown')
        ?.addEventListener('change', ui.updateGrid);
    document
        .getElementById('sizeDropdown')
        ?.addEventListener('change', ui.resizeCards);
    document
        .getElementById('sortDropdown')
        ?.addEventListener('change', sort.newSort);
    document.getElementById('syncButton')?.addEventListener('click', loadPage);
    ui.addShowHideToggle('display-btn', 'display-dropdown');
    ui.addShowHideToggle('grid-btn', 'grid-dropdown');
    ui.addShowHideToggle('size-btn', 'size-dropdown');
    ui.addShowHideToggle('sort-btn', 'sort-dropdown');
    document
        .getElementById('toggle-borders')
        ?.addEventListener('change', ui.toggleBorders);
}
//# sourceMappingURL=index.js.map