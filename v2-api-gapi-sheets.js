const SHEET_NAMES = ['db-owned', 'db-cards', 'db-binders'];
const RAW_SHEETS_DATA_KEY = 'v2_raw_sheets_data'; // also in constants module.

async function fetchAndStoreSheets(forceSync = false) {
  const db = new Localbase('db');
  db.config.debug = false;
  const storedData = await db.collection(RAW_SHEETS_DATA_KEY).get();
  if (storedData.length && !forceSync) {
    return;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    const secrets = await getSecrets();
    let response;

    try {
      response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: secrets.sheet_id,
        ranges: SHEET_NAMES,
        majorDimension: 'ROWS',
      });
    } catch (err) {
      throw new Error(err);
    }
    await db.collection(RAW_SHEETS_DATA_KEY).delete();
    await db.collection(RAW_SHEETS_DATA_KEY).add(response.result);
    await storeEachSheet(response, db);
  };
  tokenClient.requestAccessToken({ prompt: '' });
}

async function storeEachSheet(response, db) {
  for (const valueRange of response.result.valueRanges) {
    const sheetName = valueRange.range.match(/'(.*?)'/)[1];
    const header = valueRange.values[0];

    await db.collection(sheetName).delete();
    for (const e of valueRange.values.slice(1)) {
      const entry = {};
      header.forEach((h, index) => {
        entry[h] = e[index];
      });
      await db.collection(sheetName).add(entry);
    }
  }
}
