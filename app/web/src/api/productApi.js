
import axiosClient from './axiosClient';

const productApi = {
    getAll: (params) => {
        return axiosClient.get('/api/product', { params });
    },
    getById: (id) => {
        return axiosClient.get(`/api/product/${id}`);
    }
};

export default productApi;
