import axiosClient from "./axiosClient";

const userApi = {
    getProfile: () => {
        const url = '/api/user';
        return axiosClient.get(url);
    },
    updateProfile: (data) => {
        const url = '/api/user';
        return axiosClient.put(url, data);
    },
    getAddresses: () => {
        const url = '/api/user/address';
        return axiosClient.get(url);
    }
};

export default userApi;
