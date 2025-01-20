const SHEET_NAMES = ['db-owned', 'db-cards', 'db-binders'];
const RAW_SHEETS_DATA_KEY = 'v2_raw_sheets_data'; // also in constants module.

async function fetchAndStoreSheets(forceSync = false) {
  const storedData = localStorage.getItem(RAW_SHEETS_DATA_KEY);
  if (storedData && !forceSync) {
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
    localStorage.setItem(RAW_SHEETS_DATA_KEY, JSON.stringify(response.result));
    storeEachSheet(response);
  };
  tokenClient.requestAccessToken({ prompt: '' });
}

function storeEachSheet(response) {
  response.result.valueRanges.forEach((valueRange) => {
    const varName = valueRange.range.match(/'(.*?)'/)[1];
    localStorage.setItem(varName, JSON.stringify(valueRange.values));
  });
}

async function pushToSheets(range, values) {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    const secrets = await getSecrets();
    const request = {
      spreadsheetId: secrets.sheet_id,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: 'ROWS',
        values: values,
      },
    };
    try {
      const response = (
        await gapi.client.sheets.spreadsheets.values.append(request)
      ).data;
      console.log(JSON.stringify(response));
    } catch (err) {
      console.error(err);
    }
  };
  tokenClient.requestAccessToken({ prompt: '' });
}
