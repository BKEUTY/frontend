import BaseApi from './BaseApi';

class AddressApi extends BaseApi {
    constructor() {
        super('/api/address');
    }

    getProvinces() {
        return this.client.get(`${this.resource}/province`);
    }

    getDistricts(provinceId) {
        return this.client.get(`${this.resource}/district`, { params: { provinceId } });
    }

    getWards(districtId) {
        return this.client.get(`${this.resource}/ward`, { params: { districtId } });
    }
}

export default new AddressApi();
