import { useQuery } from '@tanstack/react-query';
import orderApi from '../api/orderApi';

export const useOrders = () => {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders'],
        queryFn: async () => {
            const response = await orderApi.getHistory();
            
            return response.data.map((order) => ({
                ...order,
                id: order.orderId,
                formattedDate: new Date(order.orderDate).toLocaleDateString('vi-VN'),
                formattedTotal: Number(order.total).toLocaleString("vi-VN") + 'đ',
                status: order.paymentMethod === 'Banking' && !order.qrCodeLink && order.total > 0 
                    ? 'completed' 
                    : 'pending'
            }));
        },
        retry: false,
    });

    return {
        orders: data ?? [],
        loading: isPending,
        error,
        refetch
    };
};
