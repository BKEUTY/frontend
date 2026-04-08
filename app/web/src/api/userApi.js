import BaseApi from './BaseApi';

class UserApi extends BaseApi {
    constructor() {
        super('/api/user');
    }

    getProfile(config = {}) {
        return this.client.get(this.resource, config);
    }

    updateProfile(data, config = {}) {
        return this.client.put(this.resource, data, config);
    }

    addAddress(data, config = {}) {
        return this.client.post(`${this.resource}/address`, data, config);
    }

    deleteAddress(data, config = {}) {
        return this.client.delete(`${this.resource}/address`, { data, ...config });
    }

    getAddresses(config = {}) {
        return this.client.get(`${this.resource}/address`, config);
    }
}

const userApi = new UserApi();
export default userApi;

