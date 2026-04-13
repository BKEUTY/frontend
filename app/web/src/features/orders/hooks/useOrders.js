import { useQuery } from '@tanstack/react-query';
import orderApi from '../services/orderService';

export const useOrders = (page = 0, size = 10, filters = {}) => {
    const normalizedPage = Number.isFinite(Number(page)) ? Math.max(0, Number(page)) : 0;
    const normalizedSize = Number.isFinite(Number(size)) ? Math.max(1, Number(size)) : 10;

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders', normalizedPage, normalizedSize, filters],
        queryFn: async () => {
            const response = await orderApi.getHistory({ 
                page: normalizedPage, 
                size: normalizedSize, 
                ...filters 
            });
            
            const rawData = response.data;
            
            // Handle both Page object (new) and Array (legacy/fallback)
            const content = Array.isArray(rawData) ? rawData : (rawData?.content || []);
            const totalElements = Array.isArray(rawData) ? rawData.length : (rawData?.totalElements || 0);
            const totalPages = Array.isArray(rawData) ? 1 : (rawData?.totalPages || 0);
            
            return {
                content: content.map((order) => ({
                    ...order,
                    id: order.orderId,
                    formattedDate: order.orderDate 
                        ? new Date(order.orderDate).toLocaleDateString('vi-VN') 
                        : '',
                    formattedTotal: Number(order.total || 0).toLocaleString("vi-VN") + 'đ'
                })),
                total: totalElements,
                totalPages: totalPages
            };
        },
        retry: false,
        staleTime: 30000,
    });

    return {
        orders: data?.content ?? [],
        total: data?.total ?? 0,
        loading: isPending,
        error,
        refetch
    };
};
