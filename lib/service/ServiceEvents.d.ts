export declare class ServiceEvents {
    static _instance: ServiceEvents;
    constructor();
    static get instance(): ServiceEvents;
    constructSingleTapEvent(side?: "L" | "R" | null): Promise<void>;
    constructDoubleTapEvent(side?: "L" | "R" | null): Promise<void>;
    constructTripleTapEvent(side: "L" | "R" | null | undefined, enable: boolean): Promise<void>;
}
/**
 * 0xf5
 */
export declare enum DICT_SERVICE_EVENTS {
    SINGLE_TAP = 1,
    DOUBLE_TAP = 0,
    TRIPLE_TAP_SILENT_MODE_ENABLED = 4,
    TRIPLE_TAP_SILENT_MODE_DISABLED = 5
}
//# sourceMappingURL=ServiceEvents.d.ts.map