import { useQuery } from '@tanstack/react-query';
import shippingApi from '../services/shippingService';

export const useShippingFee = (params) => {
    return useQuery({
        queryKey: ['shippingFee', params],
        queryFn: async () => {
            const { toWardCode, toDistrictId } = params;
            if (!toWardCode || !toDistrictId) return null;

            const response = await shippingApi.calculateFee({
                to_ward_code: toWardCode,
                to_district_id: Number(toDistrictId),
                weight: 100,
                service_type_id: 2
            });
            return response.data?.data?.total;

        },
        enabled: !!params?.toWardCode && !!params?.toDistrictId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useShippingLeadTime = (params) => {
    return useQuery({
        queryKey: ['shippingLeadTime', params],
        queryFn: async () => {
            const { toWardCode, toDistrictId } = params;
            if (!toWardCode || !toDistrictId) return null;

            const response = await shippingApi.calculateLeadTime({
                to_ward_code: String(toWardCode),
                to_district_id: Number(toDistrictId),
                service_type_id: 2
            });
            return response.data?.data?.leadtime_order?.to_estimate_date;
        },
        enabled: !!params?.toWardCode && !!params?.toDistrictId,
        staleTime: 5 * 60 * 1000,
    });
};

