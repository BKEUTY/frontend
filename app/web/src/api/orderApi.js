import BaseApi from './BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/api/order');
    }

    getHistory() {
        return this.client.get(`${this.resource}/history`);
    }

    placeOrder(data) {
        return this.client.post(`${this.resource}/place-order`, data);
    }
}

export default new OrderApi();
