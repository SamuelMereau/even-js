import { BleManager } from "./util/BleManager"
import { EvenProtocol } from "./util/EvenProtocol";

export const getBleManager = (): BleManager => {
    return BleManager.instance;
}

export const getEvenProtocol = (): EvenProtocol => {
    return EvenProtocol.instance;
}


