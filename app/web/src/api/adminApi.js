import BaseApi from './BaseApi';
import { adminAxiosClient, axiosClient } from './axiosClient';

class AdminApi extends BaseApi {
    constructor() {
        super('', adminAxiosClient);
    }

    async getStats() {
        try {
            const config = { skipGlobalErrorHandler: true };
            const [productsRes, usersRes, ordersRes] = await Promise.all([
                this.client.get('/product?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                this.client.get('/user?size=1', config).catch(() => ({ data: { totalElements: 0 } })),
                this.client.get('/order?size=1', config).catch(() => ({ data: { totalElements: 0 } }))
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
    }

    getAllProducts(page = 0, size = 10, config = {}) {
        return this.client.get(`/product?page=${page}&size=${size}`, config);
    }

    createProduct(data, config = {}) {
        return this.client.post('/product', data, config);
    }

    updateProduct(data, config = {}) {
        return this.client.put('/product', data, config);
    }

    createOption(data, config = {}) {
        return this.client.post('/product/options', data, config);
    }

    getVariants(productId, config = {}) {
        return this.client.get(`/product/${productId}/variants`, config);
    }

    updateVariant(data, config = {}) {
        return this.client.put('/product/variants', data, config);
    }

    uploadProductImage(file, productId, config = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId || 'temp');
        return axiosClient.post('/api/files/upload/product', formData, {
            ...config,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    uploadSkuImage(file, skuId, config = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('skuId', skuId || 'temp');
        return axiosClient.post('/api/files/upload/sku', formData, {
            ...config,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    getAllUsers(config = {}) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: { content: [] } }), 500);
        });
    }

    getAllOrders(config = {}) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ data: { content: [] } }), 500);
        });
    }
}

const adminApi = new AdminApi();
export default adminApi;

