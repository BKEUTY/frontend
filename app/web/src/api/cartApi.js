import BaseApi from './BaseApi';

class CartApi extends BaseApi {
    constructor() {
        super('/api/cart');
    }

    getAll(config = {}) {
        return this.client.get(this.resource, { 
            errorMessage: 'api_error_fetch_cart',
            skipGlobalErrorHandler: true,
            ...config
        });
    }

    add(data, config = {}) {
        return this.client.post(this.resource, data, { 
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
