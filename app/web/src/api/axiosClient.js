import axios from 'axios';
import { notification } from 'antd';
import queryString from 'query-string';
import { getTranslation } from '../i18n/translate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ROOT_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

const axiosClient = axios.create({
    baseURL: ROOT_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const status = error.response ? error.response.status : null;
    let fallbackKey = 'error_unknown';

    if (status === 401) {
        fallbackKey = 'error_401';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    } else if (status === 403) {
        fallbackKey = 'error_403';
    } else if (status === 404) {
        fallbackKey = 'error_404';
    } else if (status >= 500) {
        fallbackKey = 'error_500';
    }

    if (status !== 401 && !error.config?.skipGlobalErrorHandler) {
        const apiMessage = error.response?.data?.message;
        const description = apiMessage || getTranslation(fallbackKey);

        notification.error({
            message: getTranslation('error'),
            description: description,
            key: `global_error_${status}_${description}`,
            duration: 3,
        });
    }

    return Promise.reject(error);
});

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    // Ensure path starts with /
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    // Use ROOT_URL from above
    return `${ROOT_URL}${path}`;
};

export default axiosClient;
