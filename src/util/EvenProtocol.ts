import EventEmitter from "events";
import { ServiceEvents } from "../service/ServiceEvents";
import { BleManager } from "./BleManager";
import { BluetoothRemoteGATTCharacteristicImpl } from "webbluetooth/dist/characteristic";

export class EvenProtocol {
    private static _instance: EvenProtocol;
    private _eventEmitter: EventEmitter = new EventEmitter();

    private _lDeviceRef = BleManager.instance.leftDevice;
    private _rDeviceRef = BleManager.instance.rightDevice;

    constructor() {
        if (EvenProtocol._instance) {
            return EvenProtocol._instance;
        }
        EvenProtocol._instance = this;
        this._eventEmitter = new EventEmitter();
        this.initDeviceNotificationEventListener();
    }

    static get instance() {
        return EvenProtocol._instance || new EvenProtocol();
    }

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
    get events(): EventEmitter {
        return this._eventEmitter;
    }

    private async initDeviceNotificationEventListener(): Promise<void> {
        const bleInstance = BleManager.instance;
        const startLeftDeviceNotifications = new Promise<void>(async (resolve, reject) => {
            try {
                if (this._lDeviceRef) {
                    const lService = await this._lDeviceRef.gatt.getPrimaryService(bleInstance.UART_SERVICE_UUID);
                    const lCharacteristic = await lService.getCharacteristic(bleInstance.UART_RX_CHARACTERISTIC_UUID);
                    if (lCharacteristic.service.device.gatt.connected) {
                        await lCharacteristic.startNotifications();
                        lCharacteristic.addEventListener('characteristicvaluechanged', this.onLeftDeviceNotification.bind(this));
                        resolve();
                    }
                }
            } catch (error) {
                reject(error);
            }
        });

        const startRightDeviceNotifications = new Promise<void>(async (resolve, reject) => {
            try {
                if (this._rDeviceRef) {
                    const rService = await this._rDeviceRef.gatt.getPrimaryService(bleInstance.UART_SERVICE_UUID);
                    const rCharacteristic = await rService.getCharacteristic(bleInstance.UART_RX_CHARACTERISTIC_UUID);
                    if (rCharacteristic.service.device.gatt.connected) {
                        await rCharacteristic.startNotifications();
                        rCharacteristic.addEventListener('characteristicvaluechanged', this.onRightDeviceNotification.bind(this));
                        resolve();
                    }
                }
            } catch (error) {
                reject(error);
            }
        });

        await Promise.all([startLeftDeviceNotifications, startRightDeviceNotifications]);
    }

    private onDeviceNotification(event: Event, side: "L" | "R"): void {
        const value = (event.target as BluetoothRemoteGATTCharacteristicImpl).value;
        if (value) {
            const data = new Uint8Array(value.buffer);
            const deviceSideNotificationEvent = side === "L" ? 'leftDeviceNotification' : 'rightDeviceNotification';
            
            const dataStruct = {
                side: side,
                data: data,
            };
            
            this.emitEvent('deviceNotification', dataStruct);
            this.emitEvent(deviceSideNotificationEvent, dataStruct);

            const command = data[0];
            const subCommand = data[1];
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
    }

    private onLeftDeviceNotification(event: Event): void {
        this.onDeviceNotification(event, "L");
    }

    private onRightDeviceNotification(event: Event): void {
        this.onDeviceNotification(event, "R");
    }

    private emitEvent(eventName: string, detail: object): void {
        this._eventEmitter.emit(eventName, {
            detail: detail
        });
    }

    /**
     * Single Tap: 0xf5 0x01
     * - When checking the dashboard, you can flip to the next QuickNote by tapping the right TouchBar. Or you can read the detail of your unread notifications by tapping the left TouchBar.
     * - In the teleprompting or evenai features, forward/back the page by tapping the right/left TouchBar.
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    async fireSingleTap(side: "L"|"R"|null = null) {
        console.log("Single Tap: 0xf5 0x01");
    }

    /**
     * Double Tap: 0xf5 0x00
     * - Close the features or turn off display details
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    async fireDoubleTap(side: "L"|"R"|null = null) {
        console.log("Double Tap: 0xf5 0x00");
    }

    /**
     * Triple tap: 0xf5 0x04/0x05
     * - Toggle silent mode
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     * @param enable Triggers silent mode on or off. True for on, false for off.
     */
    async fireTripleTap(side: "L"|"R"|null = null, enable: boolean) {
        console.log("Triple Tap: 0xf5 0x04/0x05");

        await ServiceEvents.instance.constructTripleTapEvent(side, enable);
    }

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
    fireStartEvenAI(subcmd: number, param: number) {
        console.log("Start EvenAI: 0xF5");
    }

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
    fireOpenGlassesMic(enable: boolean) {
        console.log("Open Glasses Mic: 0x0E");
    }

    /**
     * Receive Glasses Mic Data: 0xF1
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - data (Audio Data): Actual Mic audio data being transmitted. (Transmitted in chunks according to the sequence)
     * 
     * @param seq The sequence number of the current data packet.
     * @param data The audio data being transmitted.
     */
    fireReceiveGlassesMicData(seq: number, data: string) {
        console.log("Receive Glasses Mic Data: 0xF1");
    }

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
    fireSendAiResult(
        seq: number, 
        totalPackageNum: number, 
        currentPackageNum: number, 
        newscreen: number
    ) {
        console.log("Send AI Result: 0x4E");
    }

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
    fireSendBmpDataPacket(seq: number, address: number[], data: number[]) {
        console.log("Send BMP Data: 0x15");
    }

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
    fireBmpDataPacketTransmissionEnds(data0: number, data1: number) {
        console.log("BMP Data Packet Transmission Ends: 0x20");
    }

    /**
     * CRC Check: 0x16
     * - crc: The crc check value calculated using Crc32Xz big endian, combined with the bmp picture storage address and picture data.
     * 
     * @param crc
     */
    fireCRCCheck(crc: number) {
        console.log("CRC Check: 0x16");
    }

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
    fireTextSending(
        seq: number, 
        totalPackageNum: number, 
        currentPackageNum: number, 
        newscreen: number
    ) {
        console.log("Text Sending: 0x4E");
    }
}