import axiosClient from "./axiosClient";

const cartApi = {
    getAll: () => {
        const url = '/api/cart';
        return axiosClient.get(url, { errorMessage: 'api_error_fetch_cart' });
    },
    add: (data) => {
        const url = '/api/cart';
        return axiosClient.post(url, data, { errorMessage: 'api_error_add_cart' });
    },

};

export default cartApi;
