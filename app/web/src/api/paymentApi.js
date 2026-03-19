import BaseApi from './BaseApi';

class PaymentApi extends BaseApi {
    constructor() {
        super('/api/payment');
    }

    checkStatus(orderId) {
        return this.client.post(`${this.resource}/status`, { orderId }, { errorMessage: 'api_error_payment_status' });
    }
}

const paymentApi = new PaymentApi();
export default paymentApi;
