"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBg = setBg;
exports.initializeGridAndSize = initializeGridAndSize;
exports.updateGrid = updateGrid;
exports.generateSizeDropdown = generateSizeDropdown;
exports.resizeCards = resizeCards;
exports.generateBinderDropdown = generateBinderDropdown;
exports.generateSetDropdown = generateSetDropdown;
exports.createProgressBar = createProgressBar;
exports.selectNewBinder = selectNewBinder;
exports.selectNewSet = selectNewSet;
exports.highlightBinder = highlightBinder;
exports.highlightSet = highlightSet;
exports.addShowHideToggle = addShowHideToggle;
exports.toggleBorders = toggleBorders;
var constants = require("./constants.js");
var page = require("./page.js");
function setBg() {
    var bgSpan = document.getElementById('bgSpan');
    var x = Math.floor(Math.random() * constants.BG_FILES.length);
    bgSpan.style.backgroundImage = "url('img/0_bg/".concat(constants.BG_FILES[x], "')");
}
function initializeGridAndSize() {
    var cardSize = initializeSizeValue();
    generateSizeDropdown(cardSize);
    var _a = initializeGridValues(), gridCol = _a.gridCol, gridRow = _a.gridRow;
    generateGridDropdown(gridCol, gridRow);
}
function initializeGridValues() {
    var gridCol = parseInt(localStorage.getItem('col'));
    var gridRow = parseInt(localStorage.getItem('row'));
    // sets defaults if not in storage
    if (isNaN(gridCol)) {
        gridCol = 0;
    }
    if (isNaN(gridRow)) {
        gridRow = 0;
    }
    localStorage.setItem('row', gridRow);
    localStorage.setItem('col', gridCol);
    return { gridCol: gridCol, gridRow: gridRow };
}
function generateGridDropdown(gridCol, gridRow) {
    var colDropdown = document.getElementById('colDropdown');
    var rowDropdown = document.getElementById('rowDropdown');
    if (rowDropdown.options.length == 0) {
        for (var i = 0; i < 13; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            colDropdown.appendChild(option);
        }
        for (var i = 0; i < 13; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            rowDropdown.appendChild(option);
        }
    }
    // sets new values
    document.getElementById('colDropdown').selectedIndex = gridCol;
    document.getElementById('rowDropdown').selectedIndex = gridRow;
}
/**
 * saves new grid and refills page
 */
function updateGrid() {
    localStorage.setItem('row', document.getElementById('rowDropdown').selectedIndex);
    localStorage.setItem('col', document.getElementById('colDropdown').selectedIndex);
    page.fillPage();
}
function initializeSizeValue() {
    var cardSize = parseInt(localStorage.getItem('cardSize'));
    // sets default if not in storage
    if (isNaN(cardSize)) {
        cardSize = 150;
    }
    // set the dropdown value to the specified size.
    localStorage.setItem('cardSize', cardSize);
    return cardSize;
}
function generateSizeDropdown(cardSize) {
    var sizeDropdown = document.getElementById('sizeDropdown');
    if (sizeDropdown.options.length == 0) {
        var sizeDropdown_1 = document.getElementById('sizeDropdown');
        for (var i = 1; i < 11; i++) {
            var option = document.createElement('option');
            option.value = i * 50;
            option.textContent = i * 50;
            sizeDropdown_1.appendChild(option);
        }
        for (var i = 1; i < 20; i++) {
            var option = document.createElement('option');
            option.value = i * 10;
            option.textContent = i * 10;
            sizeDropdown_1.appendChild(option);
        }
    }
    // sets value
    for (var i = 0; i < sizeDropdown.options.length; i++) {
        if (sizeDropdown.options[i].value == cardSize.toString()) {
            sizeDropdown.options[i].selected = true;
            break;
        }
    }
}
/**
 * saves new size and resizes cards
 */
function resizeCards() {
    var cardSize = parseInt(document.getElementById('sizeDropdown').value);
    localStorage.setItem('cardSize', cardSize);
    document
        .querySelectorAll('.card')
        .forEach(function (e) { return (e.style.width = "".concat(cardSize, "px")); });
    document
        .querySelectorAll('.card')
        .forEach(function (e) { return (e.style.height = "".concat(cardSize * 1.4, "px")); });
    document
        .querySelectorAll('.card')
        .forEach(function (e) { return (e.style.borderRadius = "".concat(cardSize / 20, "px")); });
    // HTMLCollection can't use foreach
    var ph = document.getElementsByClassName('placeholder');
    for (var i = 0, len = ph.length; i < len; i++) {
        ph[i].style.width = "".concat(cardSize, "px");
        ph[i].style.height = "".concat(cardSize * 1.4, "px");
        ph[i].style.borderRadius = "".concat(cardSize / 20, "px");
        ph[i].style.border = "".concat(cardSize / 15, "px solid transparent");
    }
}
function generateBinderDropdown() {
    var binderDropdown = document.getElementById('binderDropdown');
    var bindernames = JSON.parse(localStorage.getItem('bindernames'));
    var defaultbinder = localStorage.getItem('bindername');
    binderDropdown.innerHTML = '';
    for (var _i = 0, bindernames_1 = bindernames; _i < bindernames_1.length; _i++) {
        var binder = bindernames_1[_i];
        var option = document.createElement('option');
        option.value = binder;
        option.textContent = binder;
        if (binder == defaultbinder) {
            option.selected = 'selected';
        }
        binderDropdown.appendChild(option);
    }
}
function generateSetDropdown() {
    var setDropdown = document.getElementById('setDropdown');
    var setnames = JSON.parse(localStorage.getItem('setnames'));
    var defaultset = localStorage.getItem('setname');
    setDropdown.innerHTML = '';
    for (var _i = 0, setnames_1 = setnames; _i < setnames_1.length; _i++) {
        var set = setnames_1[_i];
        var option = document.createElement('option');
        if (set != 'set') {
            option.value = set;
            option.textContent = set;
        }
        if (set == defaultset) {
            option.selected = 'selected';
        }
        setDropdown.appendChild(option);
    }
}
function createProgressBar() {
    var span = document.getElementById('progressSpan');
    var newBar = document.createElement('progress');
    var max = page.getDataToDisplay().length;
    var numPulled = countPulled();
    var ratio = document.createTextNode("".concat(numPulled, "/").concat(max, " "));
    var percent = document.createTextNode(" ".concat(((numPulled / max) * 100).toFixed(2), "%"));
    var newSpan = document.createElement('span');
    newBar.max = max;
    newBar.value = numPulled;
    newSpan.id = 'progressSpan';
    newSpan.appendChild(ratio);
    newSpan.appendChild(newBar);
    newSpan.appendChild(percent);
    span.replaceWith(newSpan);
}
function countPulled() {
    var data = page.getDataToDisplay();
    var header = localStorage.getItem('header').split(',');
    var filtered = data.filter(function (row) { return row[header.indexOf('caught')] == 'x'; });
    return filtered.length;
}
function selectNewBinder(fillpage) {
    localStorage.setItem('container', 'binder');
    var binderDropdown = document.getElementById('binderDropdown');
    var bindername = binderDropdown.options[binderDropdown.selectedIndex].text;
    localStorage.setItem('bindername', bindername);
    highlightBinder();
    if (fillpage) {
        page.fillPage();
    }
    createProgressBar();
}
function selectNewSet(fillpage) {
    localStorage.setItem('container', 'set');
    var setDropdown = document.getElementById('setDropdown');
    var setname = setDropdown.options[setDropdown.selectedIndex].text;
    localStorage.setItem('setname', setname);
    highlightSet();
    if (fillpage) {
        page.fillPage();
    }
    createProgressBar();
}
function highlightBinder() {
    var binderDrop = document.getElementById('binderDropdown');
    binderDrop.classList.add('highlight');
    var setDrop = document.getElementById('setDropdown');
    setDrop.classList.remove('highlight');
}
function highlightSet() {
    var setDrop = document.getElementById('setDropdown');
    setDrop.classList.add('highlight');
    var binderDrop = document.getElementById('binderDropdown');
    binderDrop.classList.remove('highlight');
}
function addShowHideToggle(btnId, dropdownId) {
    document.getElementById(btnId).addEventListener('click', function () {
        var arr = document.getElementsByClassName('dropdown-container');
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var item = arr_1[_i];
            if (item.classList.contains('show') && item.id != dropdownId) {
                item.classList.toggle('show');
            }
        }
        document.getElementById(dropdownId).classList.toggle('show');
    });
}
function toggleBorders() {
    if (document.getElementById('toggle-borders').checked) {
        document.querySelectorAll('.card').forEach(function (e) {
            var en = e.getAttribute('energy-type');
            var ca = e.getAttribute('card-type');
            var borderColors = page.generateBorderColors(ca, en);
            e.style.setProperty('background', "linear-gradient(to bottom right, ".concat(borderColors, ") border-box"));
            var cardSize = parseInt(document.getElementById('sizeDropdown').value);
            e.style.setProperty('border', "".concat(cardSize / 20, "px solid transparent"));
        });
    }
    else {
        document.querySelectorAll('.card').forEach(function (e) {
            e.style.removeProperty('background');
            e.style.removeProperty('border');
        });
    }
}
