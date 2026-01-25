import axiosClient from "./axiosClient";

const orderApi = {
    getByUser: (userId) => {
        const url = `/order/${userId}`;
        return axiosClient.get(url);
    },
    placeOrder: (data) => {
        const url = '/order';
        return axiosClient.post(url, data);
    }
};

export default orderApi;
