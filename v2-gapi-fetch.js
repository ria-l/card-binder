const SHEET_NAMES = ['db-filenames', 'db-owned', 'db-cards', 'db-binders'];
const RAW_SHEETS_DATA_KEY = 'v2_raw_sheets_data'; // also in constants module.

async function fetchAndStoreSheets() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    const secrets = await getSecrets();
    let response;

    try {
      response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: secrets.SHEET_ID,
        ranges: SHEET_NAMES,
        majorDimension: 'ROWS',
      });
    } catch (err) {
      throw new Error(err);
    }
    localStorage.setItem(RAW_SHEETS_DATA_KEY, JSON.stringify(response.result));
  };
  tokenClient.requestAccessToken({ prompt: '' });
}
