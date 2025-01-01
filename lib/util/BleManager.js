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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.BleManager = void 0;
var BleManager = /** @class */ (function () {
    function BleManager() {
        this.SCAN_INTERVAL = 500;
        this.LEFT_DEVICE = null;
        this.RIGHT_DEVICE = null;
        this.SYNC_SEQ = 0;
        this.UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
        this.UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // Write
        this.UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // Read/Notify
        if (BleManager._instance) {
            return BleManager._instance;
        }
        BleManager._instance = this;
    }
    Object.defineProperty(BleManager, "instance", {
        /**
         * The BleManager instance.
         */
        get: function () {
            return BleManager._instance || new BleManager();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BleManager.prototype, "foundDevices", {
        /**
         * List of tracked devices.
         * @returns The list of found devices.
         */
        get: function () {
            var instance = BleManager.instance;
            return [instance.LEFT_DEVICE, instance.RIGHT_DEVICE].filter(function (device) { return device !== null; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BleManager.prototype, "leftDevice", {
        /**
         * Get the left device. (Even G1_L_...)
         */
        get: function () {
            return BleManager.instance.LEFT_DEVICE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BleManager.prototype, "rightDevice", {
        /**
         * Get the right device. (Even G1_R_...)
         */
        get: function () {
            return BleManager.instance.RIGHT_DEVICE;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clear the list of found devices.
     */
    BleManager.prototype.clearFoundDevices = function () {
        var instance = BleManager.instance;
        instance.LEFT_DEVICE = null;
        instance.RIGHT_DEVICE = null;
    };
    /**
     * Add peripheral to tracked list
     *
     * @param bluetoothDevice
     * @param side 0 for left, 1 for right
     */
    BleManager.prototype.addFoundDevice = function (bluetoothDevice, side) {
        switch (side) {
            case 0:
                this.LEFT_DEVICE = bluetoothDevice;
                break;
            case 1:
                this.RIGHT_DEVICE = bluetoothDevice;
                break;
            default:
                break;
        }
    };
    /**
     * Callback function for when a device is found.
     *
     * @param bluetoothDevice
     * @returns
     */
    BleManager.prototype.deviceFound = function (bluetoothDevice) {
        var instance = BleManager.instance;
        if (instance.foundDevices.length == 2)
            return;
        try {
            var discovered = instance.foundDevices.some(function (device) {
                return (device.id === bluetoothDevice.id);
            });
            if (discovered)
                return;
            if (bluetoothDevice.name.includes("_L_")) {
                instance.addFoundDevice(bluetoothDevice, 0);
            }
            else if (bluetoothDevice.name.includes("_R_")) {
                instance.addFoundDevice(bluetoothDevice, 1);
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     * Scans for Even G1 peripherals. Once found, the list of found devices is stored in the
     * BleManager instance.
     *
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found, otherwise false.
     */
    BleManager.prototype.scan = function (timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 30; }
        return new Promise(function (resolve, reject) {
            var instance = BleManager.instance;
            instance.clearFoundDevices();
            try {
                var Bluetooth = require("webbluetooth").Bluetooth;
                var bluetooth_1 = new Bluetooth({
                    scanTime: _this.SCAN_INTERVAL,
                    deviceFound: _this.deviceFound
                });
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var timeoutResolve, checkDevicesInterval;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                timeoutResolve = setTimeout(function () {
                                    clearInterval(checkDevicesInterval);
                                    resolve(false);
                                }, timeout * 1000);
                                checkDevicesInterval = setInterval(function () {
                                    if (instance.foundDevices.length >= 2) {
                                        clearTimeout(timeoutResolve);
                                        clearInterval(checkDevicesInterval);
                                        resolve(true);
                                    }
                                }, this.SCAN_INTERVAL);
                                return [4 /*yield*/, bluetooth_1.requestDevice({
                                        acceptAllDevices: true
                                    })];
                            case 1:
                                _a.sent();
                                clearTimeout(timeoutResolve);
                                resolve(false);
                                return [2 /*return*/];
                        }
                    });
                }); })();
            }
            catch (error) {
                reject(error);
            }
        });
    };
    /**
     * Connects to all devices in the found devices list.
     *
     * @returns Promise<boolean> Returns true if all devices are connected, otherwise false.
     */
    BleManager.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var instance = BleManager.instance;
            var devices = instance.foundDevices;
            var connect_tasks = devices.map(function (device) { return __awaiter(_this, void 0, void 0, function () {
                var gattServer, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, device.gatt.connect()];
                        case 1:
                            gattServer = _a.sent();
                            return [2 /*return*/, gattServer];
                        case 2:
                            error_1 = _a.sent();
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, Promise.all(connect_tasks)];
                        case 1:
                            _a.sent();
                            resolve(true);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        });
    };
    /**
     * Disconnects a device from the found devices list.
     *
     * @param index The index of the device in the found devices list to disconnect.
     */
    BleManager.prototype.disconnect = function (index) {
        var instance = BleManager.instance;
        var devices = instance.foundDevices;
        devices[index].gatt.disconnect();
        devices.splice(index, 1);
    };
    /**
     * Disconnects all devices in the found devices list.
     */
    BleManager.prototype.disconnectAll = function () {
        var instance = BleManager.instance;
        var devices = instance.foundDevices;
        devices.forEach(function (device) {
            device.gatt.disconnect();
        });
        instance.clearFoundDevices();
    };
    /**
     * Helper function to scan and connect to Even G1 peripherals in one method call.
     *
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found and connected, otherwise false.
     */
    BleManager.prototype.scanAndConnect = function (timeout) {
        if (timeout === void 0) { timeout = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var found, connected, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    return [4 /*yield*/, this.scan(timeout)];
                                case 1:
                                    found = _a.sent();
                                    if (!found) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.connect()];
                                case 2:
                                    connected = _a.sent();
                                    resolve(connected);
                                    return [3 /*break*/, 4];
                                case 3:
                                    resolve(false);
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_3 = _a.sent();
                                    reject(error_3);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Helper function to check if both devices are connected.
     * @returns True if both devices are connected, otherwise false.
     */
    BleManager.prototype.isBothConnected = function () {
        var instance = BleManager.instance;
        return (instance.foundDevices.length === 2 && instance.foundDevices.every(function (device) { return device.gatt.connected; }));
    };
    /**
     * Sends GATT data to the device/s.
     *
     * @param command Byte array command to send to the device/s.
     * @param side The side of the device to send the command to. "L" for left, "R" for right, or null for both (in order of left, then right device).
     * @returns Promise<void>
     */
    BleManager.prototype.sendCommand = function (command, side) {
        var _this = this;
        if (side === void 0) { side = null; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var sendGattData, instance, device, leftDevice, rightDevice, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sendGattData = function (device, command) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                        var instance, service, txCharacteristic, rxCharacteristic;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    instance = BleManager.instance;
                                                    if (!device.gatt.connected) {
                                                        console.error("Device ".concat(device.name, " is not connected."));
                                                        reject();
                                                    }
                                                    return [4 /*yield*/, device.gatt.getPrimaryService(instance.UART_SERVICE_UUID)];
                                                case 1:
                                                    service = _a.sent();
                                                    return [4 /*yield*/, service.getCharacteristic(instance.UART_TX_CHARACTERISTIC_UUID)];
                                                case 2:
                                                    txCharacteristic = _a.sent();
                                                    return [4 /*yield*/, service.getCharacteristic(instance.UART_RX_CHARACTERISTIC_UUID)];
                                                case 3:
                                                    rxCharacteristic = _a.sent();
                                                    return [4 /*yield*/, txCharacteristic.writeValueWithoutResponse(command.buffer)];
                                                case 4:
                                                    _a.sent();
                                                    resolve();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            });
                        }); };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        instance = BleManager.instance;
                        console.log("Side: ", side);
                        if (!side) return [3 /*break*/, 4];
                        device = side === "L" ? instance.leftDevice : instance.rightDevice;
                        if (!device) return [3 /*break*/, 3];
                        return [4 /*yield*/, sendGattData(device, command)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 10];
                    case 4:
                        leftDevice = instance.leftDevice;
                        rightDevice = instance.rightDevice;
                        if (!leftDevice) return [3 /*break*/, 7];
                        return [4 /*yield*/, sendGattData(leftDevice, command)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!rightDevice) return [3 /*break*/, 10];
                        return [4 /*yield*/, sendGattData(rightDevice, command)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        resolve();
                        return [3 /*break*/, 12];
                    case 11:
                        error_4 = _a.sent();
                        reject(error_4);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
    };
    return BleManager;
}());
exports.BleManager = BleManager;
