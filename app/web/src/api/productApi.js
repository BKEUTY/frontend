import BaseApi from './BaseApi';

class ProductApi extends BaseApi {
    constructor() {
        super('/api/product');
    }
    getVariants(id) {
        return this.client.get(`${this.resource}/${id}/variants`);
    }
}

const productApi = new ProductApi();
export default productApi;

