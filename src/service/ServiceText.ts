export class ServiceText {
    private static _instance: ServiceText;
    private readonly UART_SERVICE_UUID: string = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

    constructor() {
        if (ServiceText._instance) {
            return ServiceText._instance;
        }
        ServiceText._instance = this;
    }

    static get instance() {
        return ServiceText._instance || new ServiceText();
    }

    sendTextPacket(
        text: string, 
        pageNumber: number = 1, 
        maxPages: number = 1, 
        wait: number = 2, 
        delay: number = 0.4, 
        seq: number = 0
    ) {
        const displayWidth = 488;
        const fontSize = 21;
        const linesPerScreen = 5;
        const packetSize = 3;

        // Function to split text into lines based on display width and font size
        const splitTextIntoLines = (text: string, width: number, fontSize: number): string[] => {
            const words = text.split(' ');
            const lines: string[] = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine + word + ' ';
                const testLineWidth = testLine.length * fontSize; // Simplified width calculation

                if (testLineWidth > width) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine = testLine;
                }
            });

            if (currentLine) {
                lines.push(currentLine.trim());
            }

            return lines;
        };

        // Function to split lines into packets
        const splitLinesIntoPackets = (lines: string[], linesPerScreen: number, packetSize: number): string[][] => {
            const packets: string[][] = [];
            for (let i = 0; i < lines.length; i += linesPerScreen) {
                const screenLines = lines.slice(i, i + linesPerScreen);
                for (let j = 0; j < screenLines.length; j += packetSize) {
                    packets.push(screenLines.slice(j, j + packetSize));
                }
            }
            return packets;
        };

        // Function to send packets to the glasses
        const sendPackets = (packets: string[][]) => {
            
        };

        const lines = splitTextIntoLines(text, displayWidth, fontSize);
        const packets = splitLinesIntoPackets(lines, linesPerScreen, packetSize);
        sendPackets(packets);
    }
}