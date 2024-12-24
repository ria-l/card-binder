// update types.ts if changed
const sheets = [
  'db-all',
  'db-filenames',
  'db-owned',
  'db-cards',
  'db-binders',
  'db-sets',
];
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

/**
 * returns all the listed sheet contents
 * @param {*} e eventObject
 * @returns {string{}[][]}
 */
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  const dataObj = {};

  try {
    for (const sheetName of sheets) {
      const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
      const sheet = doc.getSheetByName(sheetName);
      const range = sheet.getDataRange();
      const data = range.getValues();
      dataObj[sheetName] = data;
    }
    return ContentService.createTextOutput(JSON.stringify(dataObj)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: err, param: e.parameter })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function testGet() {
  const eventObject = {
    parameter: {},
  };
  const data = doGet(eventObject);
  const stringified = data.getContent();
  const parsed = JSON.parse(stringified);
  console.log(parsed['db-sets'][0][0]);
}

/**
 * Marks card as caught in the 'all' sheet.
 * @param {string} stringified stringified filename array
 */
function catchCard(stringified) {
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
    catchCard(cards);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', cards: cards })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log(err);
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: err, param: e.parameter })
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
