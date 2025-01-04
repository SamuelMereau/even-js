import { BluetoothDeviceImpl } from "webbluetooth/dist/device";
export declare class BleManager {
    private static _instance;
    private readonly SCAN_INTERVAL;
    private LEFT_DEVICE;
    private RIGHT_DEVICE;
    private SYNC_SEQ;
    readonly DEVICE_PREFIX: string;
    readonly UART_SERVICE_UUID: string;
    readonly UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    readonly UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
    constructor();
    /**
     * The BleManager instance.
     */
    static get instance(): BleManager;
    /**
     * List of tracked devices.
     * @returns The list of found devices.
     */
    get foundDevices(): BluetoothDeviceImpl[];
    /**
     * Get the left device. (Even G1_L_...)
     */
    get leftDevice(): BluetoothDeviceImpl | null;
    /**
     * Get the right device. (Even G1_R_...)
     */
    get rightDevice(): BluetoothDeviceImpl | null;
    /**
     * Clear the list of found devices.
     */
    clearFoundDevices(): void;
    /**
     * Add peripheral to tracked list
     *
     * @param bluetoothDevice
     * @param side 0 for left, 1 for right
     */
    addFoundDevice(bluetoothDevice: BluetoothDeviceImpl, side: 0 | 1): void;
    /**
     * Callback function for when a device is found.
     *
     * @param bluetoothDevice
     * @returns
     */
    private deviceFound;
    /**
     * Scans for Even G1 peripherals. Once found, the list of found devices is stored in the
     * BleManager instance.
     *
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found, otherwise false.
     */
    scan(timeout?: number): Promise<boolean>;
    /**
     * Connects to all devices in the found devices list.
     *
     * @returns Promise<boolean> Returns true if all devices are connected, otherwise false.
     */
    connect(): Promise<boolean>;
    /**
     * Disconnects a device from the found devices list.
     *
     * @param index The index of the device in the found devices list to disconnect.
     */
    disconnect(index: number): void;
    /**
     * Disconnects all devices in the found devices list.
     */
    disconnectAll(): void;
    /**
     * Helper function to scan and connect to Even G1 peripherals in one method call.
     *
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found and connected, otherwise false.
     */
    scanAndConnect(timeout?: number): Promise<boolean>;
    /**
     * Helper function to check if both devices are connected.
     * @returns True if both devices are connected, otherwise false.
     */
    isBothConnected(): boolean;
    /**
     * Sends GATT data to the device/s.
     *
     * @param command Byte array command to send to the device/s.
     * @param side The side of the device to send the command to. "L" for left, "R" for right, or null for both (in order of left, then right device).
     * @returns Promise<void>
     */
    sendCommand(command: Uint8Array, side?: "L" | "R" | null): Promise<void>;
}
//# sourceMappingURL=BleManager.d.ts.map