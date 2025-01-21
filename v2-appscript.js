/**
 * @param {*} e eventObject
 * @returns {
      result: 'success',
      data: [
        [key_name, key_value],
      ],
    };
 */
function doGet(e) {
  const sheetName = 'SECRETS';
  const scriptProp = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const data = doc.getSheetByName(sheetName).getDataRange().getValues();

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', data: data })
    ).setMimeType(ContentService.MimeType.JSON);
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
  console.log(JSON.parse(stringified));
}
