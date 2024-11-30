import * as constants from './constants.js';
/**
 * fetches data from gsheet and show/hides loading status
 * TODO: refactor?
 * @returns JSON data from Google spreadsheet
 */
export async function fetchData() {
    console.log('fetching...');
    const statusSpan = document.getElementById('statusSpan');
    statusSpan.innerHTML = 'loading...';
    statusSpan.className = 'showstatus';
    const response = await fetch(constants.APPSCRIPT_URL);
    const data = await response.json();
    statusSpan.className = 'hide';
    console.log('fetched');
    return data;
}
//# sourceMappingURL=app.js.map