"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBMP = void 0;
var ServiceBMP = /** @class */ (function () {
    function ServiceBMP() {
        if (ServiceBMP._instance) {
            return ServiceBMP._instance;
        }
        ServiceBMP._instance = this;
    }
    Object.defineProperty(ServiceBMP, "instance", {
        get: function () {
            return ServiceBMP._instance || new ServiceBMP();
        },
        enumerable: false,
        configurable: true
    });
    return ServiceBMP;
}());
exports.ServiceBMP = ServiceBMP;
