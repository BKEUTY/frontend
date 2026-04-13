import { useQuery } from '@tanstack/react-query';
import orderApi from '../services/orderService';

export const useOrders = (page = 0, size = 10, filters = {}) => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders', page, size, filters],
        queryFn: async () => {
            const response = await orderApi.getHistory({ 
                page: Math.max(0, page), 
                size, 
                ...filters 
            });
            const pagedData = response.data;
            
            return {
                content: (pagedData.content || []).map((order) => ({
                    ...order,
                    id: order.orderId,
                    formattedDate: order.orderDate 
                        ? new Date(order.orderDate).toLocaleDateString('vi-VN') 
                        : '',
                    formattedTotal: Number(order.total || 0).toLocaleString("vi-VN") + 'đ'
                })),
                total: pagedData.totalElements || 0,
                totalPages: pagedData.totalPages || 0
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
