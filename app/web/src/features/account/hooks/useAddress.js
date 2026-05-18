import { useQuery } from '@tanstack/react-query';
import addressApi from '../services/addressService';

export const useProvinces = (options = {}) => {
    return useQuery({
        queryKey: ['provinces'],
        queryFn: async () => {
            const response = await addressApi.getProvinces();
            return response.data?.data || [];
        },
        staleTime: 24 * 60 * 60 * 1000, 
        ...options,
    });
};

export const useDistricts = (provinceId, options = {}) => {
    return useQuery({
        queryKey: ['districts', provinceId],
        queryFn: async () => {
            if (!provinceId) return [];
            const response = await addressApi.getDistricts(provinceId);
            return response.data?.data || [];
        },
        staleTime: 24 * 60 * 60 * 1000,
        ...options,
        enabled: (options.enabled !== undefined ? options.enabled : true) && !!provinceId,
    });
};

export const useWards = (districtId, options = {}) => {
    return useQuery({
        queryKey: ['wards', districtId],
        queryFn: async () => {
            if (!districtId) return [];
            const response = await addressApi.getWards(districtId);
            return response.data?.data || [];
        },
        staleTime: 24 * 60 * 60 * 1000,
        ...options,
        enabled: (options.enabled !== undefined ? options.enabled : true) && !!districtId,
    });
};
