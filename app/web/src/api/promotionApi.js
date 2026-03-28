import BaseApi from './BaseApi';

class PromotionApi extends BaseApi {
    constructor() {
        super('/api/promotion');
    }

    getPromotions(page = 0) {
        return this.client.get(this.resource, {
            params: { page }
        });
    }
}

const promotionApi = new PromotionApi();
export default promotionApi;
