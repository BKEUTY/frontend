import axios from 'axios';
import { notification } from 'antd';
import queryString from 'query-string';
import { getTranslation } from '../i18n/translate';

const SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const BASE_API_URL = `${SERVER_URL}/api`;
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || `${SERVER_URL}/admin/api`;

const createClient = (baseURL) => {
    const client = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        paramsSerializer: params => queryString.stringify(params),
    });

    client.interceptors.request.use(async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    client.interceptors.response.use((response) => {
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

    return client;
};

export const axiosClient = createClient(BASE_API_URL);
export const adminAxiosClient = createClient(ADMIN_API_URL);

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${SERVER_URL}${path}`;
};

export default axiosClient;
