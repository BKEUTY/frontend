import BaseApi from '@/services/BaseApi';

class OrderApi extends BaseApi {
    constructor() {
        super('/api/order');
    }

    getHistory(params = {}) {
        return this.client.get(`${this.resource}/history`, { params });
    }

    placeOrder(data) {
        return this.client.post(`${this.resource}/place-order`, data);
    }

    createRefund(formData) {
        return this.client.post(`${this.resource}/refund`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    getMyRefunds(params = {}) {
        return this.client.get(`${this.resource}/refunds`, { params });
    }
}

export default new OrderApi();

