import { BluetoothDeviceImpl } from "webbluetooth/dist/device";
import { EvenProtocol } from "./EvenProtocol";
import { BluetoothRemoteGATTCharacteristicImpl } from "webbluetooth/dist/characteristic";

export class BleManager {
    private static _instance: BleManager;
    
    private readonly SCAN_INTERVAL: number = 500;
    private LEFT_DEVICE: BluetoothDeviceImpl|null = null;
    private RIGHT_DEVICE: BluetoothDeviceImpl|null = null;
    private SYNC_SEQ: number = 0;

    readonly DEVICE_PREFIX: string = "Even G1_";
    readonly UART_SERVICE_UUID: string = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    readonly UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // Write
    readonly UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  // Read/Notify

    constructor() {
        if (BleManager._instance) {
            return BleManager._instance;
        }
        BleManager._instance = this;
    }

    /**
     * The BleManager instance.
     */
    static get instance() {
        return BleManager._instance || new BleManager();
    }

    /**
     * List of tracked devices.
     * @returns The list of found devices.
     */
    get foundDevices(): BluetoothDeviceImpl[] {
        const instance = BleManager.instance;
        return [instance.LEFT_DEVICE, instance.RIGHT_DEVICE].filter(device => device !== null) as BluetoothDeviceImpl[];
    }

    /**
     * Get the left device. (Even G1_L_...)
     */
    get leftDevice(): BluetoothDeviceImpl|null {
        return BleManager.instance.LEFT_DEVICE;
    }

    /**
     * Get the right device. (Even G1_R_...)
     */
    get rightDevice(): BluetoothDeviceImpl|null {
        return BleManager.instance.RIGHT_DEVICE;
    }

    /**
     * Clear the list of found devices.
     */
    clearFoundDevices(): void {
        const instance = BleManager.instance;
        instance.LEFT_DEVICE = null;
        instance.RIGHT_DEVICE = null;
    }

    /**
     * Add peripheral to tracked list
     * 
     * @param bluetoothDevice 
     * @param side 0 for left, 1 for right
     */
    addFoundDevice(bluetoothDevice: BluetoothDeviceImpl, side: 0|1): void {
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
    }

    /**
     * Callback function for when a device is found.
     * 
     * @param bluetoothDevice 
     * @returns
     */
    private deviceFound(bluetoothDevice: BluetoothDeviceImpl): void {
        const instance = BleManager.instance;
        if (instance.foundDevices.length == 2) return;
        try {
            const discovered = instance.foundDevices.some(device => {
                return (device.id === bluetoothDevice.id);
            });
            if (discovered) return;

            if (bluetoothDevice.name.includes("_L_")) {
                instance.addFoundDevice(bluetoothDevice, 0);
            } else if (bluetoothDevice.name.includes("_R_")) {
                instance.addFoundDevice(bluetoothDevice, 1);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Scans for Even G1 peripherals. Once found, the list of found devices is stored in the 
     * BleManager instance.
     * 
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found, otherwise false.
     */
    scan(timeout: number = 30): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const instance = BleManager.instance;
            instance.clearFoundDevices();
            try {
                const Bluetooth = require("webbluetooth").Bluetooth;
                const bluetooth = new Bluetooth({
                    scanTime: this.SCAN_INTERVAL,
                    deviceFound: this.deviceFound 
                });
    
                (async () => {
                    const timeoutResolve = setTimeout(() => {
                        clearInterval(checkDevicesInterval);
                        resolve(false);
                    }, timeout * 1000);

                    const checkDevicesInterval = setInterval(() => {
                        if (instance.foundDevices.length >= 2) {
                            clearTimeout(timeoutResolve);
                            clearInterval(checkDevicesInterval);
                            resolve(true);
                        }
                    }, this.SCAN_INTERVAL);
        
                    await bluetooth.requestDevice({
                        filters: [{ namePrefix: this.DEVICE_PREFIX }],
                        optionalServices: [this.UART_SERVICE_UUID],
                        acceptAllDevices: false
                    });

                    clearTimeout(timeoutResolve);
                    resolve(false);
                })()
            } catch(error) {
                reject(error);
            }
        });
    }

    /**
     * Connects to all devices in the found devices list.
     * 
     * @returns Promise<boolean> Returns true if all devices are connected, otherwise false.
     */
    connect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const instance = BleManager.instance;
            const devices = instance.foundDevices;
            let connect_tasks = devices.map(async (device) => {
                try {
                    const gattServer = await device.gatt.connect();
                    return gattServer;
                } catch (error) {
                    throw error;
                }
            });
    
            (async () => {
                try {
                    await Promise.all(connect_tasks);
                    resolve(true);
                } catch (error) {
                    throw error;
                }
            })()
        });
    }

    /**
     * Disconnects a device from the found devices list.
     * 
     * @param index The index of the device in the found devices list to disconnect.
     */
    disconnect(index: number): void {
        const instance = BleManager.instance;
        const devices = instance.foundDevices;
        devices[index].gatt.disconnect();
        devices.splice(index, 1);
    }

    /**
     * Disconnects all devices in the found devices list.
     */
    disconnectAll(): void {
        const instance = BleManager.instance;
        const devices = instance.foundDevices;
        devices.forEach(device => {
            device.gatt.disconnect();
        });
        instance.clearFoundDevices();
    }

    /**
     * Helper function to scan and connect to Even G1 peripherals in one method call.
     * 
     * @param timeout The time in seconds to scan for Even G1 peripherals. 30 seconds by default.
     * @returns Promise<boolean> Returns true if two Even G1 peripherals are found and connected, otherwise false.
     */
    async scanAndConnect(timeout: number = 30): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
            const found = await this.scan(timeout);
            if (found) {
                const connected = await this.connect();
                resolve(connected);
            } else {
                resolve(false);
            }
            } catch (error) {
            reject(error);
            }
        });
    }

    /**
     * Helper function to check if both devices are connected.
     * @returns True if both devices are connected, otherwise false.
     */
    isBothConnected(): boolean {
        const instance = BleManager.instance;
        return (instance.foundDevices.length === 2 && instance.foundDevices.every(device => device.gatt.connected));
    }

    /**
     * Sends GATT data to the device/s.
     * 
     * @param command Byte array command to send to the device/s.
     * @param side The side of the device to send the command to. "L" for left, "R" for right, or null for both (in order of left, then right device).
     * @returns Promise<void>
     */
    sendCommand(command: Uint8Array, side: "L"|"R"|null = null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const sendGattData = async (device: BluetoothDeviceImpl, command: Uint8Array): Promise<void> => {
                return new Promise(async (resolve, reject) => {
                    const instance = BleManager.instance;
    
                    if (!device.gatt.connected) {
                        console.error(`Device ${device.name} is not connected.`);
                        reject();
                    }
        
                    const service = await device.gatt.getPrimaryService(instance.UART_SERVICE_UUID);
                    const txCharacteristic = await service.getCharacteristic(instance.UART_TX_CHARACTERISTIC_UUID);
                    const rxCharacteristic = await service.getCharacteristic(instance.UART_RX_CHARACTERISTIC_UUID);

                    await txCharacteristic.writeValueWithoutResponse(command.buffer);

                    resolve();
                });
            }

            try {
                const instance = BleManager.instance;
                
                console.log(`Side: `, side);

                if (side) {
                    const device = side === "L" ? instance.leftDevice : instance.rightDevice;
                    if (device) {
                        await sendGattData(device, command);
                    }
                } else {
                    const leftDevice = instance.leftDevice;
                    const rightDevice = instance.rightDevice;

                    if (leftDevice) {
                        await sendGattData(leftDevice, command);
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    if (rightDevice) {
                        await sendGattData(rightDevice, command);
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}