import BaseApi from './BaseApi';

class PromotionApi extends BaseApi {
    constructor() {
        super('/api/promotion');
    }
}

const promotionApi = new PromotionApi();
export default promotionApi;
