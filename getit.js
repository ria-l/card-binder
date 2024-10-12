// this code is in appscript in the sheet

const sheetName = 'modern shinies';
const scriptProp = PropertiesService.getScriptProperties();

const initialSetup = () => {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
};

// handle GET
const doGet = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // setting up the sheet
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    // getting the header (column name) from the GET request.
    const { header } = e.parameter;

    // getting the headers (column names) from the sheet.
    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    // finding the correct column based on the header (column name).
    const column = headers.indexOf(header) + 1; // adding 1 because index is 0-based, and sheet is 1-based.

    // getting the values from the desired column.
    const data = sheet
      .getRange(2, column, sheet.getLastRow() - 1, 1)
      .getValues()
      .map((item) => item[0]);

    // returning
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', data })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
};
