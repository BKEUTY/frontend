import BaseApi from './BaseApi';
import publicAxiosClient from './publicAxiosClient';

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
