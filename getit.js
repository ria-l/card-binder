const sheetName = 'all';
const scriptProp = PropertiesService.getScriptProperties();

const initialSetup = () => {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

// handle GET
const doGet = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // setting up the sheet
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName); 

    // This represents ALL the data
    var range = sheet.getDataRange();
    var data = range.getValues();

    // returning
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', data }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', error }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function fakeGet() {
  var eventObject = 
    {
      "parameter": {
        "header": "tags"
     
    }}
  doGet(eventObject);
}

