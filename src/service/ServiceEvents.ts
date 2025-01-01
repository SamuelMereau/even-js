import { BleManager } from "../util/BleManager";

export class ServiceEvents {
    static _instance: ServiceEvents;

    constructor() {
        if (ServiceEvents._instance) {
            return ServiceEvents._instance;
        }
        ServiceEvents._instance = this;
    }

    static get instance() {
        return ServiceEvents._instance || new ServiceEvents();
    }

    async constructSingleTapEvent(side: "L"|"R"|null = null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await BleManager.instance.sendCommand(new Uint8Array([
                0xf5, 
                DICT_SERVICE_EVENTS.SINGLE_TAP
            ]), side);
            resolve();
        });
    }

    async constructDoubleTapEvent(side: "L"|"R"|null = null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await BleManager.instance.sendCommand(new Uint8Array([
                0xf5, 
                DICT_SERVICE_EVENTS.DOUBLE_TAP
            ]), side);
            resolve();
        });
    }

    async constructTripleTapEvent(side: "L"|"R"|null = null, enable: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await BleManager.instance.sendCommand(new Uint8Array([
                0xf5, 
                enable ? DICT_SERVICE_EVENTS.TRIPLE_TAP_SILENT_MODE_ENABLED : DICT_SERVICE_EVENTS.TRIPLE_TAP_SILENT_MODE_DISABLED
            ]), side);
            resolve();
        });
    }
}

/**
 * 0xf5
 */
export enum DICT_SERVICE_EVENTS {
    SINGLE_TAP = 0x01,
    DOUBLE_TAP = 0x00,
    TRIPLE_TAP_SILENT_MODE_ENABLED = 0x04,
    TRIPLE_TAP_SILENT_MODE_DISABLED = 0x05,
}