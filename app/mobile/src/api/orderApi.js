import BaseApi from './BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/api/order');
    }

    placeOrder(data) {
        return this.client.post(`${this.resource}/place-order`, data, { errorMessage: 'api_error_checkout' });
    }

    getHistory(params = {}) {
        return this.client.get(`${this.resource}/history`, { params, errorMessage: 'api_error_order_history' });
    }
}

const orderApi = new OrderApi();
export default orderApi;
