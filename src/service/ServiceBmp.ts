export class ServiceBMP {
    static _instance: ServiceBMP;

    constructor() {
        if (ServiceBMP._instance) {
            return ServiceBMP._instance;
        }
        ServiceBMP._instance = this;
    }

    static get instance() {
        return ServiceBMP._instance || new ServiceBMP();
    }
}