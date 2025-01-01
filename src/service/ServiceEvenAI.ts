export class ServiceEvenAI {
    static _instance: ServiceEvenAI;

    constructor() {
        if (ServiceEvenAI._instance) {
            return ServiceEvenAI._instance;
        }
        ServiceEvenAI._instance = this;
    }

    static get instance() {
        return ServiceEvenAI._instance || new ServiceEvenAI();
    }
}