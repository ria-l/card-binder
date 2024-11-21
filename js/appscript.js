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

/**
 *
 * @param {string} stringified stringified filename array
 */
function pullCard(stringified) {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName(sheetName);
  const parsed = JSON.parse(stringified);

  parsed.forEach((filename) => {
    const cardCell = sheet
      .createTextFinder(filename)
      .matchEntireCell(true)
      .findAll();
    const cardRow = cardCell[0].getRow();

    // get the col #
    const caught = sheet
      .createTextFinder('caught')
      .matchEntireCell(true)
      .findAll();
    const caughtCol = caught[0].getColumn();

    // fill sheet
    sheet.getRange(cardRow, caughtCol).setValue('x');
    const caughtDate = sheet
      .createTextFinder('caught date')
      .matchEntireCell(true)
      .findAll();
    const dateCol = caughtDate[0].getColumn();
    sheet
      .getRange(cardRow, dateCol)
      .setValue(Utilities.formatDate(new Date(), 'GMT-7', 'MM/dd/yyyy'));
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const cards = e.parameter['filenames'];
    pullCard(cards);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', cards: cards })
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

function testPostOne() {
  var eventObject = {
    parameter: {
      filenames: '["xyp.XY177.karen_.jpg"]',
    },
  };
  doPost(eventObject);
}

function testPostMult() {
  var eventObject = {
    parameter: {
      filenames:
        '["xyp.XY177.karen_.jpg","brs.TG22.umbreon_v.png","lor.TG17.pikachu_vmax.png"]',
    },
  };
  doPost(eventObject);
}
