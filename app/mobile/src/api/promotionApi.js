import BaseApi from './BaseApi';

class PromotionApi extends BaseApi {
    constructor() {
        super('/api/promotion');
    }

    getAll(params) {
        return this.client.get(this.resource, { params });
    }
}

const promotionApi = new PromotionApi();
export default promotionApi;
