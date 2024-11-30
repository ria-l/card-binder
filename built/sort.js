"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByRecent = exports.sortBySetNum = exports.sortByDex = exports.sortByColor = exports.sortByVisuals = exports.sortByCardType = void 0;
exports.newSort = newSort;
var page = require("./page.js");
function newSort() {
    var sortBy = document.getElementById('sortDropdown').value;
    var data = page.getDataToDisplay();
    var container = localStorage.getItem('container');
    var header = localStorage.getItem('header').split(',');
    var col;
    var name;
    if (container == 'binder') {
        col = header.indexOf('binder');
        name = localStorage.bindername;
    }
    else {
        col = header.indexOf('set');
        name = localStorage.setname;
    }
    var filtered = data.filter(function (row) { return row[col] == name; });
    filtered.unshift(header);
    if (sortBy == 'Dex #') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortByDex)(filtered)));
    }
    else if (sortBy == 'Energy Type') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortByColor)(filtered)));
    }
    else if (sortBy == 'Card Type') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortByCardType)(filtered)));
    }
    else if (sortBy == 'Set Number') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortBySetNum)(filtered)));
    }
    else if (sortBy == 'Visuals') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortByVisuals)(filtered)));
    }
    else if (sortBy == 'recent') {
        localStorage.setItem(name, JSON.stringify((0, exports.sortByRecent)(filtered)));
    }
    page.fillPage();
}
var sort = function (col_name, data) {
    var header = localStorage.getItem('header').split(',');
    var column = header.indexOf(col_name);
    return data.sort(function (a, b) {
        if (a[column] === b[column]) {
            return 0;
        }
        else {
            return a[column] < b[column] ? -1 : 1;
        }
    });
};
var sortByCardType = function (data) {
    var sorted = data.slice(1); // TODO: get rid of the need for slicing
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    sorted = sort('card type #', sorted);
    return sorted;
};
exports.sortByCardType = sortByCardType;
var sortByVisuals = function (data) {
    var sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('card type #', sorted);
    return sorted;
};
exports.sortByVisuals = sortByVisuals;
var sortByColor = function (data) {
    var sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('card type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    sorted = sort('energy type #', sorted);
    return sorted;
};
exports.sortByColor = sortByColor;
var sortByDex = function (data) {
    var sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    sorted = sort('release date', sorted);
    sorted = sort('card type #', sorted);
    sorted = sort('visuals #', sorted);
    sorted = sort('forme #', sorted);
    sorted = sort('dex #', sorted);
    return sorted;
};
exports.sortByDex = sortByDex;
var sortBySetNum = function (data) {
    var sorted = data.slice(1);
    sorted = sort('card #', sorted);
    sorted = sort('set', sorted);
    return sorted;
};
exports.sortBySetNum = sortBySetNum;
var sortByRecent = function (data) {
    var sorted = data.slice(1);
    sorted = sort('caught date', sorted);
    sorted.reverse();
    return sorted;
};
exports.sortByRecent = sortByRecent;
