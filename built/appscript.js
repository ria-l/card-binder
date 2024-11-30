var sheetName = 'all';
var scriptProp = PropertiesService.getScriptProperties();
function initialSetup() {
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    scriptProp.setProperty('key', activeSpreadsheet.getId());
}
// returns full spreadsheet
function doGet(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);
    try {
        var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
        var sheet = doc.getSheetByName(sheetName);
        var range = sheet.getDataRange();
        var data = range.getValues();
        return ContentService.createTextOutput(JSON.stringify({ result: 'success', data: data })).setMimeType(ContentService.MimeType.JSON);
    }
    catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error, param: e.parameter })).setMimeType(ContentService.MimeType.JSON);
    }
    finally {
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
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    var parsed = JSON.parse(stringified);
    parsed.forEach(function (filename) {
        var cardCell = sheet
            .createTextFinder(filename)
            .matchEntireCell(true)
            .findAll();
        var cardRow = cardCell[0].getRow();
        // get the col #
        var caught = sheet
            .createTextFinder('caught')
            .matchEntireCell(true)
            .findAll();
        var caughtCol = caught[0].getColumn();
        // fill sheet
        sheet.getRange(cardRow, caughtCol).setValue('x');
        var caughtDate = sheet
            .createTextFinder('caught date')
            .matchEntireCell(true)
            .findAll();
        var dateCol = caughtDate[0].getColumn();
        sheet
            .getRange(cardRow, dateCol)
            .setValue(Utilities.formatDate(new Date(), 'GMT-7', 'MM/dd/yyyy'));
    });
}
function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);
    try {
        var cards = e.parameter['filenames'];
        pullCard(cards);
        return ContentService.createTextOutput(JSON.stringify({ result: 'success', cards: cards })).setMimeType(ContentService.MimeType.JSON);
    }
    catch (error) {
        Logger.log(error);
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error, param: e.parameter })).setMimeType(ContentService.MimeType.JSON);
    }
    finally {
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
            filenames: '["xyp.XY177.karen_.jpg","brs.TG22.umbreon_v.png","lor.TG17.pikachu_vmax.png"]',
        },
    };
    doPost(eventObject);
}
