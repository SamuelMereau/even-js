"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEvenAI = void 0;
var ServiceEvenAI = /** @class */ (function () {
    function ServiceEvenAI() {
        if (ServiceEvenAI._instance) {
            return ServiceEvenAI._instance;
        }
        ServiceEvenAI._instance = this;
    }
    Object.defineProperty(ServiceEvenAI, "instance", {
        get: function () {
            return ServiceEvenAI._instance || new ServiceEvenAI();
        },
        enumerable: false,
        configurable: true
    });
    return ServiceEvenAI;
}());
exports.ServiceEvenAI = ServiceEvenAI;
