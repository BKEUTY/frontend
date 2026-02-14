
import axiosClient from './axiosClient';

const productApi = {
    getAll: (params) => {
        return axiosClient.get('/product', { params });
    },
    getById: (id) => {
        return axiosClient.get(`/product/${id}`);
    }
};

export default productApi;
