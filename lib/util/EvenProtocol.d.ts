/// <reference types="node" />
import EventEmitter from "events";
export declare class EvenProtocol {
    private static _instance;
    private _eventEmitter;
    private _lDeviceRef;
    private _rDeviceRef;
    constructor();
    static get instance(): EvenProtocol;
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
    get events(): EventEmitter;
    private initDeviceNotificationEventListener;
    private onDeviceNotification;
    private onLeftDeviceNotification;
    private onRightDeviceNotification;
    private emitEvent;
    /**
     * Single Tap: 0xf5 0x01
     * - When checking the dashboard, you can flip to the next QuickNote by tapping the right TouchBar. Or you can read the detail of your unread notifications by tapping the left TouchBar.
     * - In the teleprompting or evenai features, forward/back the page by tapping the right/left TouchBar.
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    fireSingleTap(side?: "L" | "R" | null): Promise<void>;
    /**
     * Double Tap: 0xf5 0x00
     * - Close the features or turn off display details
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     */
    fireDoubleTap(side?: "L" | "R" | null): Promise<void>;
    /**
     * Triple tap: 0xf5 0x04/0x05
     * - Toggle silent mode
     * @param side The side of the device that was tapped. "L" for left, "R" for right. Null for both (in order of left, then right device).
     * @param enable Triggers silent mode on or off. True for on, false for off.
     */
    fireTripleTap(side: "L" | "R" | null | undefined, enable: boolean): Promise<void>;
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
    fireStartEvenAI(subcmd: number, param: number): void;
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
    fireOpenGlassesMic(enable: boolean): void;
    /**
     * Receive Glasses Mic Data: 0xF1
     * - seq (Sequence Number): 0~255 (Sequence number of the current data packet)
     * - data (Audio Data): Actual Mic audio data being transmitted. (Transmitted in chunks according to the sequence)
     *
     * @param seq The sequence number of the current data packet.
     * @param data The audio data being transmitted.
     */
    fireReceiveGlassesMicData(seq: number, data: string): void;
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
    fireSendAiResult(seq: number, totalPackageNum: number, currentPackageNum: number, newscreen: number): void;
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
    fireSendBmpDataPacket(seq: number, address: number[], data: number[]): void;
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
    fireBmpDataPacketTransmissionEnds(data0: number, data1: number): void;
    /**
     * CRC Check: 0x16
     * - crc: The crc check value calculated using Crc32Xz big endian, combined with the bmp picture storage address and picture data.
     *
     * @param crc
     */
    fireCRCCheck(crc: number): void;
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
    fireTextSending(seq: number, totalPackageNum: number, currentPackageNum: number, newscreen: number): void;
}
//# sourceMappingURL=EvenProtocol.d.ts.map