import BaseApi from '@/services/BaseApi';

class ShippingApi extends BaseApi {
    constructor() {
        super('/api/shipping');
    }

    calculateFee(data) {
        return this.client.post(`${this.resource}/fee`, data);
    }

    calculateLeadTime(data) {
        return this.client.post(`${this.resource}/leadtime`, data);
    }
}

export default new ShippingApi();
