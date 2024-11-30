"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeData = storeData;
var sort = require("./sort.js");
/**
 *
 * @param {json obj} data all data from sheet
 */
function storeData(data) {
    var header = data[0];
    localStorage.setItem('header', header);
    // store container names
    var binderCol = header.indexOf('binder');
    var bindernames = data.filter(function (row) { return row[binderCol] != 'binder'; });
    bindernames = new Set(bindernames.map(function (row) { return row[binderCol]; }));
    var setCol = header.indexOf('set');
    var setnames = data.filter(function (row) { return row[setCol] != 'set'; });
    setnames = new Set(setnames.map(function (row) { return row[setCol]; }));
    localStorage.setItem("bindernames", JSON.stringify(__spreadArray([], bindernames, true)));
    localStorage.setItem("setnames", JSON.stringify(__spreadArray([], setnames, true)));
    // store set and binder names
    var bindername = localStorage.getItem('bindername');
    if (!bindername) {
        var x = Math.floor(Math.random() * bindernames.size);
        bindername = Array.from(bindernames)[x];
        localStorage.setItem('bindername', bindername);
    }
    var setname = localStorage.getItem('setname');
    if (!setname) {
        var y = Math.floor(Math.random() * setnames.size);
        setname = Array.from(setnames)[y];
        localStorage.setItem('setname', setname);
    }
    var _loop_1 = function (name_1) {
        // only the cards that are in the given binder
        var filtered = data.filter(function (row) { return row[binderCol] == name_1; });
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(name_1, JSON.stringify(sort.sortByColor(filtered)));
    };
    // store data for each container
    for (var _i = 0, bindernames_1 = bindernames; _i < bindernames_1.length; _i++) {
        var name_1 = bindernames_1[_i];
        _loop_1(name_1);
    }
    var _loop_2 = function (name_2) {
        // only the cards that are in the given binder
        var filtered = data.filter(function (row) { return row[setCol] == name_2; });
        // add back the header, since it would be removed during filtering
        filtered.unshift(header);
        localStorage.setItem(name_2, JSON.stringify(sort.sortByColor(filtered)));
    };
    for (var _a = 0, setnames_1 = setnames; _a < setnames_1.length; _a++) {
        var name_2 = setnames_1[_a];
        _loop_2(name_2);
    }
}
