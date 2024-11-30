"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("./app.js");
var constants = require("./constants.js");
var page = require("./page.js");
var store = require("./store.js");
var ui = require("./ui.js");
window.onload = function () {
    ui.setBg();
    document.getElementById('form').action = constants.APPSCRIPT_URL;
    if (localStorage.getItem('pull_status') == 'SUCCESS') {
        initializePull();
    }
    else {
        fetchAndInitializePull();
    }
    setEventListeners();
};
function initializePull() {
    console.log('loading from storage');
    ui.generateBinderDropdown();
    ui.generateSetDropdown();
    var container = localStorage.getItem('container');
    if (container == 'binder') {
        ui.highlightBinder();
    }
    else if (container == 'set') {
        ui.highlightSet();
    }
    ui.createProgressBar();
    localStorage.setItem('pull_status', 'SUCCESS');
}
function fetchAndInitializePull() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, app.fetchData()];
                case 1:
                    data = _a.sent();
                    store.storeData(data.data);
                    initializePull();
                    return [2 /*return*/];
            }
        });
    });
}
function setEventListeners() {
    var binderDropdown = document.getElementById('binderDropdown');
    binderDropdown.addEventListener('change', function () {
        ui.selectNewBinder();
    });
    var setDropdown = document.getElementById('setDropdown');
    setDropdown.addEventListener('change', function () {
        ui.selectNewSet();
    });
    var pullOneButton = document.getElementById('pullOneButton');
    pullOneButton.addEventListener('click', function () {
        pullCards(1);
    });
    var pullFiveButton = document.getElementById('pullFiveButton');
    pullFiveButton.addEventListener('click', function () {
        pullCards(5);
    });
    var pullTenButton = document.getElementById('pullTenButton');
    pullTenButton.addEventListener('click', function () {
        pullCards(10);
    });
    var clearDisplayButton = document.getElementById('clearDisplayButton');
    clearDisplayButton.addEventListener('click', function () {
        clearDisplay();
    });
    var syncButton = document.getElementById('syncButton');
    syncButton.addEventListener('click', function () {
        fetchAndInitializePull();
    });
    ui.addShowHideToggle('display-btn', 'display-dropdown');
}
function clearDisplay() {
    document.getElementById('largeCardSpan').innerHTML = '';
    document.getElementById('smallCardSpan').innerHTML = '';
    document.getElementById('listSpan').innerHTML = '';
    var listSpan = document.getElementById('listSpan');
    var ol = document.createElement('ol');
    ol.id = 'cardList';
    ol.reversed = true;
    listSpan.appendChild(ol);
}
/**
 *
 * @param {int} n number of cards pulled
 */
function pullCards(n) {
    var container = localStorage.getItem('container');
    var data;
    if (container == 'binder' || !container) {
        var bindername = localStorage.getItem('bindername');
        data = JSON.parse(localStorage.getItem(bindername));
    }
    else {
        var setname = localStorage.getItem('setname');
        data = JSON.parse(localStorage.getItem(setname));
    }
    var cardPool = data.map(function (row) { return constants.getMetadatum('filename', row); });
    var pulled = [];
    for (var i = 0; i < n; i++) {
        // max val is length - 1
        var x = Math.floor(Math.random() * cardPool.length);
        pulled.push(x);
    }
    processPulled(pulled, data);
}
/**
 *
 * @param {array of ints} pulled index numbers in the filenames array
 */
function processPulled(pulled, data) {
    var newCards = [];
    var currentPulls = [];
    pulled.forEach(function (card) {
        var binderRow = data[card];
        var _a = getCardMetadata(binderRow), title = _a.title, dir = _a.dir, filename = _a.filename, caught = _a.caught, borderColors = _a.borderColors;
        var small = generateImg('small', dir, filename, caught, borderColors);
        document
            .getElementById('smallCardSpan')
            .insertBefore(small, smallCardSpan.firstChild);
        currentPulls.push(generateImg('large', dir, filename, caught, borderColors));
        if (!caught) {
            newCards.push(filename);
        }
        addToList(title);
    });
    displayLarge(currentPulls);
    if (newCards.length) {
        processNewCards(newCards);
    }
}
function getCardMetadata(binderRow) {
    var header = localStorage.getItem('header').split(',');
    var filename = constants.getMetadatum('filename', binderRow, header);
    var caught = constants.getMetadatum('caught', binderRow, header);
    var cardtype = constants.getMetadatum('cardtype', binderRow, header);
    var energytype = constants.getMetadatum('energytype', binderRow, header);
    var set = constants.getMetadatum('set', binderRow, header);
    var title = "".concat(filename, " : ").concat(energytype, " : ").concat(cardtype);
    if (!caught) {
        title += " \u2728NEW\u2728";
    }
    var borderColors = page.generateBorderColors(cardtype, energytype);
    var dir = "img/".concat(set.toLowerCase());
    return { title: title, dir: dir, filename: filename, caught: caught, borderColors: borderColors };
}
function generateImg(size, dir, filename, caught, borderColors) {
    var img = document.createElement('img');
    img.src = "".concat(dir, "/").concat(filename);
    if (size == 'small') {
        img.classList.add('small-card');
        img.onclick = function () {
            displayLarge([generateImg('large', dir, filename, caught, borderColors)]);
        };
    }
    else if (size == 'large') {
        img.classList.add('large-card');
    }
    if (caught) {
        img.classList.add('caught');
    }
    img.style.setProperty('background', "linear-gradient(to bottom right, ".concat(borderColors, ") border-box"));
    return img;
}
function displayLarge(imgs) {
    var largeCardSpan = document.getElementById('largeCardSpan');
    var newSpan = document.createElement('span');
    newSpan.id = 'largeCardSpan';
    imgs.forEach(function (img) {
        newSpan.insertBefore(img, newSpan.firstChild);
    });
    largeCardSpan.replaceWith(newSpan);
}
function addToList(title) {
    var ol = document.getElementById('cardList');
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(title));
    ol.insertBefore(li, ol.firstChild);
}
function processNewCards(newCards) {
    updateNewCardsInCache(newCards);
    ui.createProgressBar();
    document.getElementById('filenamesInput').value = JSON.stringify(newCards);
    document.getElementById('form').submit();
}
function updateNewCardsInCache(newCards) {
    var binderName = localStorage.getItem('bindername');
    var binderData = JSON.parse(localStorage.getItem(binderName));
    var header = localStorage.getItem('header').split(',');
    newCards.forEach(function (filename) {
        for (var rowNum = 0; rowNum < binderData.length; rowNum++) {
            if (constants.getMetadatum('filename', binderData[rowNum], header) ==
                filename) {
                binderData[rowNum][header.indexOf('caught')] = 'x';
                break;
            }
        }
        // each card may have a different set, so need to handle storage individually
        var setName = filename.match(/^[^\.]*/)[0].toUpperCase();
        var setData = JSON.parse(localStorage.getItem(setName));
        for (var rowNum = 0; rowNum < setData.length; rowNum++) {
            if (constants.getMetadatum('filename', setData[rowNum], header) == filename) {
                setData[rowNum][header.indexOf('caught')] = 'x';
                localStorage.setItem(setName, JSON.stringify(setData));
                break;
            }
        }
    });
    // only set after all cards are updated
    localStorage.setItem(binderName, JSON.stringify(binderData));
}
