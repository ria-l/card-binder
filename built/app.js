import * as constants from './constants.js';
/**
 *
 * @returns JSON data from Google spreadsheet
 */
export async function fetchData() {
    console.log('fetching...');
    const statusSpan = document.getElementById('statusSpan');
    if (statusSpan) {
        statusSpan.innerHTML = 'loading...';
        statusSpan.className = 'showstatus';
        const response = await fetch(constants.APPSCRIPT_URL);
        const data = await response.json();
        statusSpan.className = 'hide';
        console.log('fetched');
        return data;
    }
    else {
        console.log('❌ statusSpan missing');
    }
}
//# sourceMappingURL=app.js.map