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
  authUser();
  retryAddModuleToPage();
}

async function authUser() {
  console.log('Authorizing user...');
  // Create a promise to wait for the callback to complete
  const tokenRequestPromise = new Promise((resolve, reject) => {
    // Set the callback on tokenClient
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        reject(resp); // Reject if there's an error
      } else {
        resolve(resp); // Resolve when we get a valid response
      }
    };
  });
  // Await the token request, which will pause until the promise resolves/rejects
  await tokenClient.requestAccessToken({ prompt: '' });
  // Wait for the token request's callback to complete
  await tokenRequestPromise;
}

function addModuleToPage() {
  let moduleScript = document.createElement('script');
  moduleScript.defer = true;
  moduleScript.type = 'module';
  const urlPath = new URL(document.URL).pathname;
  if (urlPath.includes('pull.html')) {
    moduleScript.src = 'built/pull.js';
  } else if (urlPath.includes('binder.html')) {
    moduleScript.src = 'built/binder.js';
  } else if (urlPath.includes('index.html')) {
    moduleScript.src = 'built/index.js';
  }
  document.head.appendChild(moduleScript);
  console.log(moduleScript, ' module successfully added.');
}

async function retryAddModuleToPage(maxRetries = 5, delay = 2000) {
  let attempts = 0;

  while (attempts < maxRetries) {
    if (gapiInited && gisInited) {
      console.log('Both gapi and gis are initialized, adding module...');
      addModuleToPage();
      return;
    }

    // If not initialized, retry after waiting for the delay
    attempts++;
    console.log(
      `Attempt ${attempts}: gapiInited = ${gapiInited}, gisInited = ${gisInited}. Retrying in ${
        delay / 1000
      } seconds...`
    );

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  console.log('Max retries reached. gapi or gis is not initialized.');
  throw new Error('Failed to initialize gapi and gis after maximum retries');
}
