"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var os_1 = require("os");
function ls(path) {
    return fs_1.promises.readdir(path || os_1.homedir());
}
exports.default = ls;
