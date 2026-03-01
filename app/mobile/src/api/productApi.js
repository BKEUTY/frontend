import BaseApi from './BaseApi';

class ProductApi extends BaseApi {
    constructor() {
        super('/admin/api/product');
    }

    // Backend missing getById, keeping hardcode
    getById(id) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: { id, name: "Product " + id } }), 500);
        });
    }
}

const productApi = new ProductApi();
export default productApi;
