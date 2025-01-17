import * as constants from './v2-constants.js';

/**
 * fetches data from gsheet and show/hides loading status
 * @returns JSON data from Google spreadsheet
 */
export async function fetchData() {
  const statusSpan = document.getElementById('statusSpan');
  const showStatus = (message: string, className: string) => {
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
  } catch (error) {
    console.error('Error fetching data:', error);
    showStatus(`Failed to load data ${error}`, 'show');
    throw error;
  }
}
