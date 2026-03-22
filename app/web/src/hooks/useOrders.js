import { useQuery } from '@tanstack/react-query';
import orderApi from '../api/orderApi';

export const useOrders = () => {
    const { data: orders = [], isLoading: loading, refetch } = useQuery({
        queryKey: ['myOrders'],
        queryFn: async () => {
            try {
                const response = await orderApi.getHistory();
                
                const data = Array.isArray(response) ? response : (response?.data || []);

                if (!Array.isArray(data)) return [];
                
                return data.map((order, index) => {
                    const formattedDate = order.orderDate 
                        ? new Date(order.orderDate).toLocaleDateString('vi-VN') 
                        : '';

                    return {
                        id: order.orderId || order.id || `ORD-${index + 1}`,
                        date: formattedDate,
                        total: order.total != null ? Number(order.total).toLocaleString("vi-VN") + 'đ' : '0đ',
                        status: (order.paymentMethod === 'Banking' && !order.qrCodeLink) ? 'completed' : 'pending'
                    };
                });
            } catch (error) {
                console.error("Lỗi fetch đơn hàng:", error);
                return [];
            }
        },
        refetchOnMount: true,
        retry: false, 
    });

    return {
        orders,
        loading,
        refetch
    };
};
