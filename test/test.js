const { BleManager } = require("../lib/util/BleManager");
const { EvenProtocol } = require("../lib/util/EvenProtocol");

(async () => {
    const found = await BleManager.instance.scanAndConnect();
    if (found) {
        console.log('Found devices:', found);
    } else {
        console.log('No devices found');
    }

    const protocol = new EvenProtocol();

    protocol.events.on('singleTap', (data) => {
        console.log('Single tap detected:', data);
    });

    protocol.events.on('doubleTap', (data) => {
        console.log('Double tap detected:', data);
    });
    
    protocol.events.on('tripleTap', (data) => {
        console.log('Triple tap detected:', data);
    });


    protocol.events.on('deviceNotification', (data) => {
        // Convert data from Uin8Array to hexadecimal string
        const byteData = [...data.detail.data].map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        console.table({data, byteData});
    });

    // Example usage:
    await protocol.fireTripleTap('L', true);
})();

