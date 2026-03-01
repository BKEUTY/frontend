import BaseApi from './BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/user/api/order');
    }

    getByUser(userId) {
        return this.client.get(`${this.resource}/${userId}`, { errorMessage: 'api_error_order_history' });
    }

    placeOrder(data) {
        return this.client.post(this.resource, data, { errorMessage: 'api_error_checkout' });
    }
}

const orderApi = new OrderApi();
export default orderApi;

