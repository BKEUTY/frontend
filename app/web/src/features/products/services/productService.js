import BaseApi from '@/services/BaseApi';
import publicAxiosClient from '@/services/publicAxiosClient';

class ProductApi extends BaseApi {
    constructor() {
        super('/api/product', publicAxiosClient);
    }

    getCategories() {
        return this.client.get(`${this.resource}/categories`);
    }
}

const productApi = new ProductApi();
export default productApi;
