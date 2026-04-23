import BaseApi from '@/services/BaseApi';
import publicAxiosClient from '@/services/publicAxiosClient';

class ProductApi extends BaseApi {
    constructor() {
        super('/api/product', publicAxiosClient);
    }

    getCategories() {
        return this.client.get(`${this.resource}/categories`);
    }

    getPromotionMetadata(data) {
        return this.client.post(`${this.resource}/promotion-metadata`, data);
    }
}

const productApi = new ProductApi();
export default productApi;
