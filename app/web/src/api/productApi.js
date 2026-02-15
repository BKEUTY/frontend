
import axiosClient from './axiosClient';

const productApi = {
    getAll: (params) => {
        return axiosClient.get('/product', { params, errorMessage: 'api_error_fetch_products' });
    },
    getById: (id) => {
        return axiosClient.get(`/product/${id}`, { errorMessage: 'api_error_product_detail' });
    }
};

export default productApi;
