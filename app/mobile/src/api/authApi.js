import axiosClient from "./axiosClient";

const authApi = {
    login: (data) => {
        const url = '/api/auth/login';
        return axiosClient.post(url, data);
    },
    register: (data) => {
        const url = '/api/auth/register';
        return axiosClient.post(url, data);
    },
    refresh: (data) => {
        const url = '/api/auth/refresh';
        return axiosClient.post(url, data, { skipGlobalErrorHandler: true });
    }
};

export default authApi;
