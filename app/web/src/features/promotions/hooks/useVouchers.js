import { useQuery } from '@tanstack/react-query';
import promotionApi from '../services/promotionService';

export const useVouchers = (params = {}) => {
    return useQuery({
        queryKey: ['vouchers', params],
        queryFn: async () => {
            const res = await promotionApi.getAll({ ...params, status: 'STARTING', size: 100 });
            const allPromos = res?.content || res?.data?.content || [];
            return allPromos.filter(p => p.promotionType === 'VoucherPromotion');
        }
    });
};
