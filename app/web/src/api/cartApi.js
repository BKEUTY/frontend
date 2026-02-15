import axiosClient from "./axiosClient";

const cartApi = {
    getAll: (userId) => {
        const url = `/cart/${userId}`;
        return axiosClient.get(url, { errorMessage: 'api_error_fetch_cart' });
    },
    add: (data) => {
        const url = '/cart';
        return axiosClient.post(url, data, { errorMessage: 'api_error_add_cart' });
    },

};

export default cartApi;
