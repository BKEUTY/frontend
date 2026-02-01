import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ADMIN_BASE_URL = BASE_URL.endsWith('/api')
    ? BASE_URL.slice(0, -4)
    : BASE_URL;

const adminAxios = axios.create({
    baseURL: ADMIN_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const adminApi = {
    // Dashboard Stats
    getStats: async () => {
        try {
            const [products] = await Promise.all([
                adminAxios.get('/admin/api/product?size=1'),
                axios.get(`${BASE_URL}/user`)
            ]);

            return {
                products: products.data.totalElements || 0,
                users: 0,
                orders: 0,
                revenue: 0
            };
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
            return { products: 0, users: 0, orders: 0, revenue: 0 };
        }
    },

    // --- PRODUCTS ---
    getAllProducts: (page = 0, size = 10) => {
        return adminAxios.get(`/admin/api/product?page=${page}&size=${size}`);
    },

    createProduct: (data) => {
        return adminAxios.post('/admin/api/product', data);
    },

    updateProduct: (data) => {
        return adminAxios.put('/admin/api/product', data);
    },

    // --- OPTIONS & VARIANTS ---
    createOption: (data) => {
        return adminAxios.post('/admin/api/product/options', data);
    },

    getVariants: (productId) => {
        return adminAxios.get(`/admin/api/product/${productId}/variants`);
    },

    updateVariant: (data) => {
        return adminAxios.put('/admin/api/product/variants', data);
    },

    // --- UPLOAD ---
    uploadProductImage: (file, productId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId || 'temp');
        return axios.post(`${BASE_URL}/files/upload/product`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    uploadSkuImage: (file, skuId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('skuId', skuId || 'temp');
        return axios.post(`${BASE_URL}/files/upload/sku`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getAllUsers: () => {
        return axios.get(`${BASE_URL}/user`);
    },

    getAllOrders: () => {
        return axios.get(`${BASE_URL}/orders`);
    }
};

export default adminApi;
