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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvenProtocol = void 0;
var events_1 = __importDefault(require("events"));
var ServiceEvents_1 = require("../service/ServiceEvents");
var BleManager_1 = require("./BleManager");
var EvenProtocol = /** @class */ (function () {
    function EvenProtocol() {
        this._eventEmitter = new events_1.default();
        this._lDeviceRef = BleManager_1.BleManager.instance.leftDevice;
        this._rDeviceRef = BleManager_1.BleManager.instance.rightDevice;
        if (EvenProtocol._instance) {
            return EvenProtocol._instance;
        }
        EvenProtocol._instance = this;
        this._eventEmitter = new events_1.default();
        this.initDeviceNotificationEventListener();
    }
    Object.defineProperty(EvenProtocol, "instance", {
        get: function () {
            return EvenProtocol._instance || new EvenProtocol();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EvenProtocol.prototype, "events", {
        /**
         * Event emitter for Even Protocol events
         * @returns {EventEmitter}
         * @event deviceNotification - All device notifications
         * @event leftDeviceNotification - Notifications only from left device
         * @event rightDeviceNotification - Notifications only from right device
         * @event singleTap - Single Tap: 0xf5 0x01
         * @event doubleTap - Double Tap: 0xf5 0x00
         * @event tripleTap - Triple tap: 0xf5 0x04/0x05
         * @event startEvenAI - Start EvenAI: 0xF5
         * @event openGlassesMic - Open Glasses Mic: 0x0E
         * @event receiveGlassesMicData - Receive Glasses Mic Data: 0xF1
         * @event sendAiResult - Send AI Result: 0x4E
         * @event sendBmpDataPacket - Send BMP Data: 0x15
         * @event bmpDataPacketTransmissionEnds - BMP Data Packet Transmission Ends: 0x20
         * @event crcCheck - CRC Check: 0x16
         * @event textSending - Text Sending: 0x4E
         */
        get: function () {
            return this._eventEmitter;
        },
        enumerable: false,
        configurable: true
    });
    EvenProtocol.prototype.initDeviceNotificationEventListener = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bleInstance, startLeftDeviceNotifications, startRightDeviceNotifications;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bleInstance = BleManager_1.BleManager.instance;
                        startLeftDeviceNotifications = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var lService, lCharacteristic, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        if (!this._lDeviceRef) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this._lDeviceRef.gatt.getPrimaryService(bleInstance.UART_SERVICE_UUID)];
                                    case 1:
                                        lService = _a.sent();
                                        return [4 /*yield*/, lService.getCharacteristic(bleInstance.UART_RX_CHARACTERISTIC_UUID)];
                                    case 2:
                                        lCharacteristic = _a.sent();
                                        if (!lCharacteristic.service.device.gatt.connected) return [3 /*break*/, 4];
                                        return [4 /*yield*/, lCharacteristic.startNotifications()];
                                    case 3:
                                        _a.sent();
                                        lCharacteristic.addEventListener('characteristicvaluechanged', this.onLeftDeviceNotification.bind(this));
                                        resolve();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_1 = _a.sent();
                                        reject(error_1);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        startRightDeviceNotifications = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var rService, rCharacteristic, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        if (!this._rDeviceRef) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this._rDeviceRef.gatt.getPrimaryService(bleInstance.UART_SERVICE_UUID)];
                                    case 1:
                                        rService = _a.sent();
                                        return [4 /*yield*/, rService.getCharacteristic(bleInstance.UART_RX_CHARACTERISTIC_UUID)];
                                    case 2:
                                        rCharacteristic = _a.sent();
                                        if (!rCharacteristic.service.device.gatt.connected) return [3 /*break*/, 4];
                                        return [4 /*yield*/, rCharacteristic.startNotifications()];
                                    case 3:
                                        _a.sent();
                                        rCharacteristic.addEventListener('characteristicvaluechanged', this.onRightDeviceNotification.bind(this));
                                        resolve();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_2 = _a.sent();
                                        reject(error_2);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all([startLeftDeviceNotifications, startRightDeviceNotifications])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EvenProtocol.prototype.onDeviceNotification = function (event, side) {
        var value = event.target.value;
        if (value) {
            var data = new Uint8Array(value.buffer);
            var deviceSideNotificationEvent = side === "L" ? 'leftDeviceNotification' : 'rightDeviceNotification';
            var dataStruct = {
                side: side,
                data: data,
            };
            this.emitEvent('deviceNotification', dataStruct);
            this.emitEvent(deviceSideNotificationEvent, dataStruct);
            var command = data[0];
            var subCommand = data[1];
            switch (command) {
                case 0xf5:
                    switch (subCommand) {
                        case 0x01:
                            this.emitEvent('singleTap', {
                                side: side
                            });
                            break;
                        case 0x00:
                            this.emitEvent('doubleTap', {
                                side: side
                            });
                            break;
                        case 0x04:
                            this.emitEvent('tripleTap', {
                                side: side,
                                enable: true
                            });
                            break;
                        case 0x05:
                            this.emitEvent('tripleTap', {
                                side: side,
                                enable: false
                            });
                            break;
                    }
                    break;
                case 0x0E:
                    this.emitEvent('openGlassesMic', {
                        enable: subCommand === 1
                    });
                    break;
                case 0xF1:
                    this.emitEvent('receiveGlassesMicData', {
                        seq: subCommand,
                        data: data.slice(2).toString()
                    });
                    break;
                case 0x4E:
                    this.emitEvent('sendAiResult', {
                        seq: subCommand,
                        totalPackageNum: data[2],
                        currentPackageNum: data[3],
                        newscreen: data[4]
                    });
                    break;
                case 0x15:
                    this.emitEvent('sendBmpDataPacket', {
                        seq: subCommand,
                        address: Array.from(data.slice(2, 6)),
                        data: Array.from(data.slice(6))
                    });
                    break;
                case 0x20:
                    this.emitEvent('bmpDataPacketTransmissionEnds', {
                        data0: subCommand,
                        data1: data[2]
                    });
                    break;
                case 0x16:
                    this.emitEvent('crcCheck', {
                        crc: subCommand
                    });
                    break;
                case 0x4E:
                    this.emitEvent('textSending', {
                        seq: subCommand,
                        totalPackageNum: data[2],
                        currentPackageNum: data[3],
                        newscreen: data[4]
                    });
                    break;
            }
        }
    };
    EvenProtocol.prototype.onLeftDeviceNotification = function (event) {
        this.onDeviceNotification(event, "L");
    };
    EvenProtocol.prototype.onRightDeviceNotification = function (event) {
        this.onDeviceNotification(event, "R");
    };
    EvenProtocol.prototype.emitEvent = function (eventName, detail) {
        this._eventEmitter.emit(eventName, {
            detail: detail
        });
    };
    /**
     * Single Tap: 0xf5 0x01
     * - When checking the dashboard, you can flip to the next QuickNote by tapping the right TouchBar. Or you can read the detail of your unread notifications by tapping the left TouchBar.
     * - In the teleprompting or evenai features, forward/back the page by tapping the right/left TouchBar.
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    EvenProtocol.prototype.fireSingleTap = function (side) {
        if (side === void 0) { side = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Single Tap: 0xf5 0x01");
                return [2 /*return*/];
            });
        });
    };
    /**
     * Double Tap: 0xf5 0x00
     * - Close the features or turn off display details
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    EvenProtocol.prototype.fireDoubleTap = function (side) {
        if (side === void 0) { side = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Double Tap: 0xf5 0x00");
                return [2 /*return*/];
            });
        });
    };
    /**
     * Triple tap: 0xf5 0x04/0x05
     * - Toggle silent mode
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     * @param enable Triggers silent mode on or off. True for on, false for off.
     */
    EvenProtocol.prototype.fireTripleTap = function (side, enable) {
        if (side === void 0) { side = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Triple Tap: 0xf5 0x04/0x05");
                        return [4 /*yield*/, ServiceEvents_1.ServiceEvents.instance.constructTripleTapEvent(side, enable)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start EvenAI: 0xF5
     * - subcmd (Sub-command): 0~255
     *     - subcmd: 0 (exit to dashboard manually). Stop all advanced features and return to the dashboard.
     *     - subcmd: 1 (page up/down control in manual mode). Page-up (left ble) / page-down (right ble).
     *     - subcmd: 23 (start Even AI). Notify phone to activate Even AI.
     *     - subcmd: 24 (stop Even AI recording). Even AI recording ended.
     * - param (Parameters): Specific parameters associated with each sub-command.
     *
     * @param subcmd The sub-command to execute
     * @param param The parameters associated with the sub-command
     */
    EvenProtocol.prototype.fireStartEvenAI = function (subcmd, param) {
        console.log("Start EvenAI: 0xF5");
    };
    /**
     * Open Glasses Mic: 0x0E
     * - Enable: 0 (Disable, turn off sound pickup) / 1 (Enable, turn on sound pickup)
     *
     * *Response from glasses: 0x0E*
     * - *rsp_status (Response Status): 0xC9: Success, 0xCA: Failure*
     * - *enable: 0: Mic disabled, 1: Mic enabled*
     *
     * @param enable Enable or disable the microphone. True for enable, false for disable.
     */
    EvenProtocol.prototype.fireOpenGlassesMic = function (enable) {
        console.log("Open Glasses Mic: 0x0E");
    };
    /**
     * Receive Glasses Mic Data: 0xF1
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - data (Audio Data): Actual Mic audio data being transmitted. (Transmitted in chunks according to the sequence)
     *
     * @param seq The sequence number of the current data packet.
     * @param data The audio data being transmitted.
     */
    EvenProtocol.prototype.fireReceiveGlassesMicData = function (seq, data) {
        console.log("Receive Glasses Mic Data: 0xF1");
    };
    /**
     * Send AI Result: 0x4E
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - totalPackageNum (Total Package Count): 1~255 (The total number of packages being sent in this transmission)
     * - currentPackageNum (Current Package Number): 0~255 (The current package number within the total, starting from 0)
     * - newscreen (Screen Status) (Composed of lower 4 bits and upper 4 bits to represent screen status and Even AI mode)
     *     - Lower 4 Bits (Screen Action):
     *       - 0x01: Display new content
     *     - Upper 4 Bits (Even AI Status):
     *       - 0x30: Even AI displaying (automatic mode default)
     *       - 0x40: Even AI display complete (Used when the last page of automatic mode)
     *       - 0x50: Even AI manual mode
     *       - 0x60: Even AI network error
     *
     * @param seq The sequence number of the current data packet.
     * @param totalPackageNum The total number of packages being sent in this transmission.
     * @param currentPackageNum The current package number within the total, starting from 0.
     * @param newscreen The screen status and Even AI mode.
     */
    EvenProtocol.prototype.fireSendAiResult = function (seq, totalPackageNum, currentPackageNum, newscreen) {
        console.log("Send AI Result: 0x4E");
    };
    /**
     * Send BMP Data: 0x15
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - address: [0x00, 0x1c, 0x00, 0x00] (BMP address in the glasses, just attached in the first pack)
     * - data0 ~ data194: BMP data packet
     *
     * @param seq The sequence number of the current data packet.
     * @param address BMP address in the glasses, just attached in the first pack.
     * @param data BMP data packet
     */
    EvenProtocol.prototype.fireSendBmpDataPacket = function (seq, address, data) {
        console.log("Send BMP Data: 0x15");
    };
    /**
     * BMP Data Packet Transmission Ends: 0x20
     * - data0: 0x0d
     * - data1: 0x0e
     *
     * Fixed format command: [0x20, 0x0d, 0x0e]
     *
     * @param data0 0x0d
     * @param data1 0x0e
     */
    EvenProtocol.prototype.fireBmpDataPacketTransmissionEnds = function (data0, data1) {
        console.log("BMP Data Packet Transmission Ends: 0x20");
    };
    /**
     * CRC Check: 0x16
     * - crc: The crc check value calculated using Crc32Xz big endian, combined with the bmp picture storage address and picture data.
     *
     * @param crc
     */
    EvenProtocol.prototype.fireCRCCheck = function (crc) {
        console.log("CRC Check: 0x16");
    };
    /**
     * Text Sending: 0x4E
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - totalPackageNum (Total Package Count): 1~255 (The total number of packages being sent in this transmission)
     * - currentPackageNum (Current Package Number): 0~255 (The current package number within the total, starting from 0)
     * - newscreen (Screen Status) (Composed of lower 4 bits and upper 4 bits to represent screen status and Even AI mode)
     *    - Lower 4 Bits (Screen Action):
     *      - 0x01: Display new content
     *   - Upper 4 Bits (Status):
     *     - 0x70: Text Show
     */
    EvenProtocol.prototype.fireTextSending = function (seq, totalPackageNum, currentPackageNum, newscreen) {
        console.log("Text Sending: 0x4E");
    };
    return EvenProtocol;
}());
exports.EvenProtocol = EvenProtocol;
