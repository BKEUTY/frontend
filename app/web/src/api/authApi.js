import BaseApi from './BaseApi';

class AuthApi extends BaseApi {
    constructor() {
        super('/api/auth');
    }

    login(data) {
        return this.client.post(`${this.resource}/login`, data);
    }

    register(data) {
        return this.client.post(`${this.resource}/register`, data);
    }

    refresh(data) {
        return this.client.post(`${this.resource}/refresh`, data || {}, { 
            skipGlobalErrorHandler: true 
        });
    }

    logout() {
        return this.client.post(`${this.resource}/logout`);
    }
}

const authApi = new AuthApi();
export default authApi;
