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
}

const userApi = new UserApi();
export default userApi;
