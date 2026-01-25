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
    // Backend doesn't support update/delete yet
    // update: (id, data) => axiosClient.put(`/cart/${id}`, data),
    // remove: (id) => axiosClient.delete(`/cart/${id}`),
};

export default cartApi;
