import axios from 'axios';
import { notification } from 'antd';
import queryString from 'query-string';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Derive ROOT_URL for axios base (e.g. http://localhost:8080)
// This allows uniform access to /api/... and /admin/api/...
const ROOT_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

const axiosClient = axios.create({
    baseURL: ROOT_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});

// Request Interceptor
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
axiosClient.interceptors.response.use((response) => {
    // We return the full response to allow access to status codes and headers
    return response;
}, (error) => {
    // Handle Errors Global
    const status = error.response ? error.response.status : null;
    let message = 'Có lỗi xảy ra, vui lòng thử lại.';

    if (status === 401) {
        message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        // Optional: Redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    } else if (status === 403) {
        message = 'Bạn không có quyền truy cập tài nguyên này.';
    } else if (status === 404) {
        message = 'Không tìm thấy tài nguyên yêu cầu.';
    } else if (status >= 500) {
        message = 'Lỗi hệ thống máy chủ.';
    }

    // Show notification for errors (except 401 maybe, to avoid spam if redirecting)
    // and check for skipGlobalErrorHandler in request config
    if (status !== 401 && !error.config?.skipGlobalErrorHandler) {
        const description = error.response?.data?.message || message;
        notification.error({
            message: 'Lỗi',
            description: description,
            key: `global_error_${status}_${description}`, // Prevent duplicates
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
