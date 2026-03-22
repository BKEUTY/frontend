import axiosClient from "./axiosClient";

import { getAccessToken } from "./tokenStorage";

const cartApi = {
    getAll: () => {
        const url = '/api/cart';
        const token = getAccessToken();
        return axiosClient.get(url, { 
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            errorMessage: 'api_error_fetch_cart',
            skipGlobalErrorHandler: true
        });
    },
    add: (data) => {
        const url = '/api/cart';
        const token = getAccessToken();
        return axiosClient.post(url, data, { 
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            errorMessage: 'api_error_add_cart',
            skipGlobalErrorHandler: true
        });
    }
};

export default cartApi;
