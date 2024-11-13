const sheetName = 'all';
const scriptProp = PropertiesService.getScriptProperties();

const initialSetup = () => {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
};

// returns full spreadsheet
const doGet = (e) => {
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
};

function fakeGet() {
  var eventObject = {
    parameter: {},
  };
  doGet(eventObject);
}

const catchCard = (cardName) => {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName(sheetName);

  const card = sheet.createTextFinder(cardName).matchEntireCell(true).findAll();
  const row = card[0].getRow();

  const caught = sheet
    .createTextFinder('caught')
    .matchEntireCell(true)
    .findAll();
  const col = caught[0].getColumn();

  sheet.getRange(row, col).setValue('x');
};

const doPost = (e) => {
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
};

function fakePost() {
  var eventObject = {
    parameter: {
      filename: 'xyp.XY177.karen_.jpg',
    },
  };
  doPost(eventObject);
}
