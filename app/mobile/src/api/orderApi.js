import BaseApi from './BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/user/api/order');
    }

    placeOrder(data) {
        return this.create(data, { errorMessage: 'api_error_checkout' });
    }

    getByUser(userId) {
        return this.client.get(`${this.resource}/${userId}`, { errorMessage: 'api_error_order_history' });
    }
}

const orderApi = new OrderApi();
export default orderApi;
