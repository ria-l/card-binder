import * as constants from './constants.js';

export async function fetchData() {
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
  } catch (error) {
    console.error('Error fetching data:', error);
    showStatus(`Failed to load data ${error}`, 'show');
    throw error;
  }
}
