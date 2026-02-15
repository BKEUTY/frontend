import axiosClient from "./axiosClient";

const orderApi = {
    getByUser: (userId) => {
        const url = `/order/${userId}`;
        return axiosClient.get(url, { errorMessage: 'api_error_order_history' });
    },
    placeOrder: (data) => {
        const url = '/order';
        return axiosClient.post(url, data, { errorMessage: 'api_error_checkout' });
    }
};

export default orderApi;
