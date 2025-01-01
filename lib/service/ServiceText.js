"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceText = void 0;
var ServiceText = /** @class */ (function () {
    function ServiceText() {
        this.UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
        if (ServiceText._instance) {
            return ServiceText._instance;
        }
        ServiceText._instance = this;
    }
    Object.defineProperty(ServiceText, "instance", {
        get: function () {
            return ServiceText._instance || new ServiceText();
        },
        enumerable: false,
        configurable: true
    });
    ServiceText.prototype.sendTextPacket = function (text, pageNumber, maxPages, wait, delay, seq) {
        if (pageNumber === void 0) { pageNumber = 1; }
        if (maxPages === void 0) { maxPages = 1; }
        if (wait === void 0) { wait = 2; }
        if (delay === void 0) { delay = 0.4; }
        if (seq === void 0) { seq = 0; }
        var displayWidth = 488;
        var fontSize = 21;
        var linesPerScreen = 5;
        var packetSize = 3;
        // Function to split text into lines based on display width and font size
        var splitTextIntoLines = function (text, width, fontSize) {
            var words = text.split(' ');
            var lines = [];
            var currentLine = '';
            words.forEach(function (word) {
                var testLine = currentLine + word + ' ';
                var testLineWidth = testLine.length * fontSize; // Simplified width calculation
                if (testLineWidth > width) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                }
                else {
                    currentLine = testLine;
                }
            });
            if (currentLine) {
                lines.push(currentLine.trim());
            }
            return lines;
        };
        // Function to split lines into packets
        var splitLinesIntoPackets = function (lines, linesPerScreen, packetSize) {
            var packets = [];
            for (var i = 0; i < lines.length; i += linesPerScreen) {
                var screenLines = lines.slice(i, i + linesPerScreen);
                for (var j = 0; j < screenLines.length; j += packetSize) {
                    packets.push(screenLines.slice(j, j + packetSize));
                }
            }
            return packets;
        };
        // Function to send packets to the glasses
        var sendPackets = function (packets) {
        };
        var lines = splitTextIntoLines(text, displayWidth, fontSize);
        var packets = splitLinesIntoPackets(lines, linesPerScreen, packetSize);
        sendPackets(packets);
    };
    return ServiceText;
}());
exports.ServiceText = ServiceText;
