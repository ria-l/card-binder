import * as constants from './constants.js';

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
