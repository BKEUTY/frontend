import BaseApi from './BaseApi';

class RecommendationApi extends BaseApi {
    constructor() {
        super('/api/product/recommendations');
    }

    getPersonalized() {
        return this.client.get(`${this.resource}/personalized`);
    }

    getRelated(productName) {
        return this.client.get(`${this.resource}/related`, {
            params: { productName }
        });
    }
}

const recommendationApi = new RecommendationApi();
export default recommendationApi;
