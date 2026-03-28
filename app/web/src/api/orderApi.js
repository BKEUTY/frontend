import BaseApi from './BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/api/order');
    }

    getHistory() {
        return this.client.get(`${this.resource}/history`, { 
            errorMessage: 'api_error_order_history' 
        });
    }

    placeOrder(data) {
        return this.client.post(`${this.resource}/place-order`, data, { 
            errorMessage: 'api_error_checkout' 
        });
    }
}

const orderApi = new OrderApi();
export default orderApi;
