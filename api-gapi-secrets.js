// Retrieve and store secrets from Google sheet.
// These include Google API keys and other secrets needed to initialize gAPI.
// This file is vanilla JS instead of TS because the Sheets API does not easily support TS. TODO: convert to TS if possible

// localstorage keys. also in constants module.
const SECRETS_KEY = 'v2_secrets';
const APPSCRIPT_URL_KEY = 'v2_appscript_url';

async function getSecrets() {
  const db = new Localbase('db');
  const secrets = await db.collection(SECRETS_KEY).get();
  if (secrets.length) {
    return secrets[0];
  } else {
    return await fetchAndStoreSecretsOrThrow();
  }
}

async function fetchAndStoreSecretsOrThrow() {
  const url = getAppscriptUrl();
  try {
    const data = await fetchSecrets(url);
    const secrets = {};
    for (const secret of data) {
      secrets[secret[0]] = secret[1];
    }

    const db = new Localbase('db');
    await db.collection(SECRETS_KEY).delete();
    await db.collection(SECRETS_KEY).add(secrets);
    console.log('secrets stored: ', secrets);

    return secrets;
  } catch (error) {
    throw new Error(error);
  }
}

function getAppscriptUrl() {
  const url = localStorage.getItem(APPSCRIPT_URL_KEY);
  if (url) {
    return url;
  }
  while (true) {
    const input = prompt('Appscript URL') ?? null;
    // if user clicks "cancel"
    if (input === null) {
      console.error('No URL inputted');
      return '';
    }
    localStorage.setItem(APPSCRIPT_URL_KEY, input);
    console.log('appscript url stored.');
    return input;
  }
}

async function fetchSecrets(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data = await response.json();
    console.log('secrets fetched: ', data.data);
    return data.data;
  } catch (error) {
    throw new Error(error);
  }
}
