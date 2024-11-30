"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillPage = fillPage;
exports.generateBorderColors = generateBorderColors;
exports.getDataToDisplay = getDataToDisplay;
var constants = require("./constants.js");
function fillPage() {
    var data = getDataToDisplay();
    var cardTags = createCardTags(data);
    var tables = createTables(cardTags);
    document.getElementById('contentDiv').innerHTML = '';
    tables.forEach(function (table) {
        document.getElementById('contentDiv').appendChild(table);
    });
}
function createTables(cardTags) {
    var rows = parseInt(document.getElementById('rowDropdown').selectedIndex);
    var cols = parseInt(document.getElementById('colDropdown').selectedIndex);
    var allTables = [];
    var currentTable;
    var currentRow;
    cardTags.forEach(function (tag, i) {
        if (!rows || !cols) {
            allTables.push(tag);
            var spaceNode = document.createTextNode(' ');
            allTables.push(spaceNode);
        }
        else {
            // Use the remainder value from the modulo function to put each card into a row/grid bucket.
            var rowIndex = (i + 1) % cols;
            var gridIndex = (i + 1) % (rows * cols);
            var table = document.createElement('table');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(tag);
            // first card in grid
            if (gridIndex == 1) {
                currentTable = table;
            }
            // middle cards
            if (rowIndex == 1) {
                // first card in row
                currentRow = tr;
                currentRow.appendChild(td);
            }
            else if (rowIndex == 0) {
                // last card in row
                if (cols == 1) {
                    currentRow = tr;
                }
                if (rows == 1) {
                    currentTable = table;
                }
                currentRow.appendChild(td);
                currentTable.appendChild(currentRow);
            }
            else {
                currentRow.appendChild(td);
            }
            // last card in grid
            if (gridIndex == 0) {
                if (cols == 1) {
                    currentRow = tr;
                }
                if (rows == 1) {
                    currentTable = table;
                }
                allTables.push(currentTable);
                currentTable = null;
            }
            // Any cards that don't fit neatly into the grid
            if (currentTable) {
                currentTable.appendChild(currentRow);
                allTables.push(currentTable);
            }
        }
    });
    return allTables;
}
function createCardTags(data) {
    var cardSize = document.getElementById('sizeDropdown').value;
    var tags = [];
    var header = localStorage.getItem('header').split(',');
    for (var rowNum = 0; rowNum < data.length; rowNum++) {
        var set = constants
            .getMetadatum('set', data[rowNum], header)
            .toLowerCase();
        var dir = "img/".concat(set);
        var filename = constants.getMetadatum('filename', data[rowNum], header);
        var energytype = constants.getMetadatum('energytype', data[rowNum], header);
        var cardtype = constants.getMetadatum('cardtype', data[rowNum], header);
        var visuals = constants.getMetadatum('visuals', data[rowNum], header);
        var caught = constants.getMetadatum('caught', data[rowNum], header);
        var title = "".concat(filename, " : ").concat(energytype, " : ").concat(cardtype, " : ").concat(visuals);
        if (caught == 'x') {
            tags.push(generateImgTag(dir, filename, title, cardSize, cardtype, energytype));
        }
        else {
            var borderColors = generateBorderColors(cardtype, energytype);
            var fillColors = constants.FILL_COLORS(visuals, energytype);
            tags.push(generatePlaceholder(cardSize, title, borderColors, fillColors));
        }
    }
    return tags;
}
function generateImgTag(dir, filename, title, cardSize, cardtype, energytype) {
    var img = document.createElement('img');
    img.src = "".concat(dir, "/").concat(filename);
    img.title = title;
    img.style.width = "".concat(cardSize, "px");
    img.style.height = "".concat(cardSize * 1.4, "px"); // keeps cards that are a couple pixels off of standard size from breaking alignment
    img.style.borderRadius = "".concat(cardSize / 20, "px");
    img.classList.add('card');
    img.setAttribute('card-type', cardtype);
    img.setAttribute('energy-type', energytype);
    if (document.getElementById('toggle-borders').checked) {
        var borderColors = generateBorderColors(cardtype, energytype);
        img.style.background = "linear-gradient(to bottom right, ".concat(borderColors, ") border-box");
        img.style.setProperty('border', "".concat(cardSize / 15, "px solid transparent"));
    }
    img.onclick = function () {
        displayZoom(dir, filename);
    };
    return img;
}
function displayZoom(dir, filename) {
    var img = document.createElement('img');
    img.src = "".concat(dir, "/").concat(filename);
    img.style.height = '90dvh';
    var zoomSpan = document.getElementById('zoom-span');
    img.onclick = function () {
        // close zoomed card
        zoomSpan.innerHTML = '';
    };
    // clear any already zoomed cards
    if (zoomSpan.innerHTML) {
        zoomSpan.innerHTML = '';
    }
    img.className = 'zoomed-card';
    zoomSpan.appendChild(img);
}
function generatePlaceholder(cardSize, title, borderColors, fillColors) {
    // note that there are a couple other styles in the css file
    var ph = document.createElement('span');
    ph.className = 'placeholder';
    ph.title = title;
    ph.style.width = "".concat(cardSize, "px");
    ph.style.height = "".concat(cardSize * 1.4, "px"); // keeps cards that are a couple pixels off of standard size from breaking alignment
    ph.style.background = "linear-gradient(to bottom right, ".concat(fillColors, ") padding-box, linear-gradient(to bottom right, ").concat(borderColors, ") border-box");
    ph.style.borderRadius = "".concat(cardSize / 20, "px");
    ph.style.border = "".concat(cardSize / 15, "px solid transparent");
    return ph;
}
function generateBorderColors(cardtype, energytype) {
    var energyColors = constants.ENERGY_COLORS[energytype];
    var cardColors = constants.CARD_COLORS[cardtype];
    if (cardtype == 'basic') {
        return "".concat(energyColors, ",").concat(energyColors, ",").concat(energyColors[1]);
    }
    else if (cardtype != 'basic') {
        return "".concat(energyColors, ",white,").concat(cardColors);
    }
}
function getDataToDisplay() {
    var binderName = localStorage.getItem('bindername');
    var setName = localStorage.getItem('setname');
    var container = localStorage.getItem('container');
    if (!container || container === 'binder') {
        return JSON.parse(localStorage.getItem(binderName));
    }
    else if (container === 'set') {
        return JSON.parse(localStorage.getItem(setName));
    }
}
