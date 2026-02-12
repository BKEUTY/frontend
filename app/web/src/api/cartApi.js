import axiosClient from "./axiosClient";

const cartApi = {
    getAll: (userId) => {
        const url = `/cart/${userId}`;
        return axiosClient.get(url);
    },
    add: (data) => {
        const url = '/cart';
        return axiosClient.post(url, data);
    },

};

export default cartApi;
