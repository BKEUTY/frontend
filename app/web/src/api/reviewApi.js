import BaseApi from './BaseApi';
import publicAxiosClient from './publicAxiosClient';

class ReviewApi extends BaseApi {
    constructor() {
        super('/api/user/reviews');
    }

    getReviewsByVariantId(variantId, params = {}, config = {}) {
        return publicAxiosClient.get(`/api/reviews/product/${variantId}`, {
            params,
            ...config
        });
    }

    uploadImage(formData, config = {}) {
        return this.client.post(`${this.resource}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            ...config
        });
    }
}

export default new ReviewApi();
