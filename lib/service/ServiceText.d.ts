export declare class ServiceText {
    private static _instance;
    private readonly UART_SERVICE_UUID;
    constructor();
    static get instance(): ServiceText;
    sendTextPacket(text: string, pageNumber?: number, maxPages?: number, wait?: number, delay?: number, seq?: number): void;
}
//# sourceMappingURL=ServiceText.d.ts.map