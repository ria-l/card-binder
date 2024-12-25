import * as constants from './constants.js';
/**
 * fetches data from gsheet and show/hides loading status
 * @returns JSON data from Google spreadsheet
 */
export async function fetchGSheetsData() {
    // TODO: factor out the loading status
    const statusSpan = document.getElementById('statusSpan');
    const showStatus = (message, className) => {
        if (statusSpan) {
            statusSpan.innerHTML = message;
            statusSpan.className = className;
        }
    };
    try {
        console.log('fetching...');
        showStatus('loading...', 'showstatus');
        const response = await fetch(constants.APPSCRIPT_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        showStatus('', 'hide');
        console.log('fetched');
        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        showStatus(`Failed to load data ${error}`, 'show');
        throw error;
    }
}
export async function fetchTcgSets() {
    const apiKey = localStorage.getItem('tcg_api_key') ?? getTcgApiKey();
    try {
        const response = await fetch('https://api.pokemontcg.io/v2/sets', {
            method: 'GET',
            headers: {
                'X-Api-Key': `${apiKey}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tcgData = await response.json();
        const returnVal = tcgData.data.sort((a, b) => {
            return (new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf());
        });
        return returnVal;
    }
    catch (error) {
        console.error('Error fetching sets:', error);
    }
}
export function getTcgApiKey() {
    while (true) {
        let input = prompt('TCG API key') ?? null;
        // user clicks "cancel"
        if (input === null) {
            console.error(`If you aren't using an API key, you are rate limited to 1000 requests a day, and a maximum of 30 per minute.`);
            return '';
        }
        if (apiKeyIsValid(input)) {
            localStorage.setItem('tcg_api_key', input);
            return input;
        }
        else {
            alert(`Enter a valid UUIDv4-formatted API key.`);
        }
    }
    function apiKeyIsValid(input) {
        const uuidVerFourRegexp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}');
        return uuidVerFourRegexp.test(input);
    }
}
//# sourceMappingURL=api_clients.js.map