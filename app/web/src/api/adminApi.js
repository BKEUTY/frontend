import axiosClient from './axiosClient';

const adminApi = {
    // Dashboard Stats
    getStats: async () => {
        try {
            // Use skipGlobalErrorHandler to prevent 3 separate notifications on load
            const config = { skipGlobalErrorHandler: true };

            const [productsRes, usersRes, ordersRes] = await Promise.all([
                axiosClient.get('/admin/api/product?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                axiosClient.get('/admin/api/user?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                axiosClient.get('/admin/api/order?size=1', config).catch(() => ({ data: { totalElements: 0 } }))
            ]);

            return {
                products: productsRes.data?.totalElements || 0,
                users: usersRes.data?.totalElements || 0,
                orders: ordersRes.data?.totalElements || 0,
                revenue: 0 // Fetch revenue separate if needed
            };
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
            return { products: 0, users: 0, orders: 0, revenue: 0 };
        }
    },

    // --- PRODUCTS ---
    getAllProducts: (page = 0, size = 10, config = {}) => {
        return axiosClient.get(`/admin/api/product?page=${page}&size=${size}`, config);
    },

    createProduct: (data, config = {}) => {
        return axiosClient.post('/admin/api/product', data, config);
    },

    updateProduct: (data, config = {}) => {
        return axiosClient.put('/admin/api/product', data, config);
    },

    // --- OPTIONS & VARIANTS ---
    createOption: (data, config = {}) => {
        return axiosClient.post('/admin/api/product/options', data, config);
    },

    getVariants: (productId, config = {}) => {
        return axiosClient.get(`/admin/api/product/${productId}/variants`, config);
    },

    updateVariant: (data, config = {}) => {
        return axiosClient.put('/admin/api/product/variants', data, config);
    },

    // --- UPLOAD ---
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
        return axiosClient.get('/admin/api/user', config);
    },

    getAllOrders: (config = {}) => {
        return axiosClient.get('/admin/api/orders', config);
    }
};

export default adminApi;
