import BaseApi from '@/services/BaseApi';

class CartApi extends BaseApi {
    constructor() {
        super('/api/cart');
    }

    getAll(params = {}, config = {}) {
        return super.getAll(params, { 
            errorMessage: 'api_error_fetch_cart',
            skipGlobalErrorHandler: true,
            ...config
        });
    }

    create(data, config = {}) {
        return super.create(data, { 
            errorMessage: 'api_error_add_cart',
            skipGlobalErrorHandler: true,
            ...config
        });
    }

    decrease(cartId, config = {}) {
        return this.client.put(`${this.resource}/${cartId}/minus`, {}, {
            errorMessage: 'api_error_update_cart',
            skipGlobalErrorHandler: true,
            ...config
        });
    }
}

const cartApi = new CartApi();
export default cartApi;
