import { useQuery } from '@tanstack/react-query';
import orderApi from '../api/orderApi';

export const useOrders = () => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders'],
        queryFn: async () => {
            const response = await orderApi.getHistory();
            const rawData = Array.isArray(response) ? response : response?.data;

            if (!Array.isArray(rawData)) return [];

            return rawData.map((order, index) => {
                const formattedDate = order.orderDate 
                    ? new Date(order.orderDate).toLocaleDateString('vi-VN') 
                    : '---';

                return {
                    id: order.orderId || order.id || `ORD-${index + 1}`,
                    date: formattedDate,
                    total: order.total ? Number(order.total).toLocaleString("vi-VN") + 'đ' : '0đ',
                    status: (order.paymentMethod === 'Banking' && !order.qrCodeLink && order.total > 0) 
                        ? 'completed' 
                        : 'pending'
                };
            });
        },
        retry: false,
    });

    return {
        orders: data || [],
        loading: isPending,
        error,
        refetch
    };
};