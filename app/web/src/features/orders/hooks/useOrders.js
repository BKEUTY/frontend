import { useQuery } from '@tanstack/react-query';
import orderApi from '../services/orderService';

export const useOrders = () => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders'],
        queryFn: async () => {
            const response = await orderApi.getHistory();
            return (response.data || []).map((order) => ({
                ...order,
                id: order.orderId,
                formattedDate: order.orderDate 
                    ? new Date(order.orderDate).toLocaleDateString('vi-VN') 
                    : '',
                formattedTotal: Number(order.total || 0).toLocaleString("vi-VN") + 'đ'
            }));
        },
        retry: false,
        staleTime: 0,
    });

    return {
        orders: data ?? [],
        loading: isPending,
        error,
        refetch
    };
};
