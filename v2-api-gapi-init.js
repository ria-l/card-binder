// Google Sheets API auth and init functions.
// This file is vanilla JS instead of TS because the Sheets API does not easily support TS. TODO: convert to TS if possible

const DISCOVERY_DOC =
  'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'; // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  const secrets = await getSecrets();
  await gapi.client.init({
    apiKey: secrets.gsheets_api_key,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  addModuleToPage();
}

/**
 * Callback after Google Identity Services are loaded.
 */
async function gisLoaded() {
  const secrets = await getSecrets();
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: secrets.client_id,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  addModuleToPage();
}

function addModuleToPage() {
  if (gapiInited && gisInited) {
    console.log('successfully initiated gapi');
    let moduleScript = document.createElement('script');
    moduleScript.defer = true;
    moduleScript.type = 'module';
    const urlPath = new URL(document.URL).pathname;
    if (urlPath.includes('pull.html')) {
      moduleScript.src = 'built/v2-pull.js';
    } else if (urlPath.includes('index.html')) {
      moduleScript.src = 'built/v2-index.js';
    }
    document.head.appendChild(moduleScript);
    console.log('module script added to page.');
  }
}
