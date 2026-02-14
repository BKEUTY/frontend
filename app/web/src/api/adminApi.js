import { adminAxiosClient, axiosClient } from './axiosClient';

const adminApi = {
    getStats: async () => {
        try {
            const config = { skipGlobalErrorHandler: true };

            const [productsRes, usersRes, ordersRes] = await Promise.all([
                adminAxiosClient.get('/product?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                adminAxiosClient.get('/user?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                adminAxiosClient.get('/order?size=1', config).catch(() => ({ data: { totalElements: 0 } }))
            ]);

            return {
                products: productsRes.data?.totalElements || 0,
                users: usersRes.data?.totalElements || 0,
                orders: ordersRes.data?.totalElements || 0,
                revenue: 0
            };
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
            return { products: 0, users: 0, orders: 0, revenue: 0 };
        }
    },

    getAllProducts: (page = 0, size = 10, config = {}) => {
        return adminAxiosClient.get(`/product?page=${page}&size=${size}`, config);
    },

    createProduct: (data, config = {}) => {
        return adminAxiosClient.post('/product', data, config);
    },

    updateProduct: (data, config = {}) => {
        return adminAxiosClient.put('/product', data, config);
    },

    createOption: (data, config = {}) => {
        return adminAxiosClient.post('/product/options', data, config);
    },

    getVariants: (productId, config = {}) => {
        return adminAxiosClient.get(`/product/${productId}/variants`, config);
    },

    updateVariant: (data, config = {}) => {
        return adminAxiosClient.put('/product/variants', data, config);
    },

    uploadProductImage: (file, productId, config = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId || 'temp');
        return axiosClient.post('/files/upload/product', formData, {
            ...config,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    uploadSkuImage: (file, skuId, config = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('skuId', skuId || 'temp');
        return axiosClient.post('/files/upload/sku', formData, {
            ...config,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getAllUsers: (config = {}) => {
        return adminAxiosClient.get('/user', config);
    },

    getAllOrders: (config = {}) => {
        return adminAxiosClient.get('/order', config);
    }
};

export default adminApi;
