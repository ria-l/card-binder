const sheetName = 'all';
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

// returns full spreadsheet
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    const range = sheet.getDataRange();
    const data = range.getValues();

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', data })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error, param: e.parameter })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function fakeGet() {
  var eventObject = {
    parameter: {},
  };
  doGet(eventObject);
}

function catchCard(cardName) {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName(sheetName);

  const card = sheet.createTextFinder(cardName).matchEntireCell(true).findAll();
  const card_row = card[0].getRow();

  const caught = sheet
    .createTextFinder('caught')
    .matchEntireCell(true)
    .findAll();
  const caught_col = caught[0].getColumn();
  sheet.getRange(card_row, caught_col).setValue('x');

  const caught_date = sheet
    .createTextFinder('caught date')
    .matchEntireCell(true)
    .findAll();
  const date_col = caught_date[0].getColumn();
  sheet
    .getRange(card_row, date_col)
    .setValue(Utilities.formatDate(new Date(), 'GMT-7', 'MM/dd/yyyy'));
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const card = e.parameter['filename'];
    catchCard(card);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', card: card })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(error);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error, param: e.parameter })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function fakePost() {
  var eventObject = {
    parameter: {
      filename: 'xyp.XY177.karen_.jpg',
    },
  };
  doPost(eventObject);
}
