"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvenProtocol = exports.getBleManager = void 0;
var BleManager_1 = require("./util/BleManager");
var EvenProtocol_1 = require("./util/EvenProtocol");
var getBleManager = function () {
    return BleManager_1.BleManager.instance;
};
exports.getBleManager = getBleManager;
var getEvenProtocol = function () {
    return EvenProtocol_1.EvenProtocol.instance;
};
exports.getEvenProtocol = getEvenProtocol;
