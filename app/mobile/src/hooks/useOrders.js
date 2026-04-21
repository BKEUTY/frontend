import { useQuery } from '@tanstack/react-query';
import orderApi from '../api/orderApi';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Hook for fetching user order history.
 */
export const useOrders = (params = {}) => {
  const { t } = useLanguage();
  return useQuery({
    queryKey: ['myOrders', params],
    queryFn: async () => {
      const response = await orderApi.getHistory(params);
      const rawData = response.data || [];
      
      return rawData.map(order => ({
        ...order,
        id: order.orderId || order.id,
        date: order.orderDate,
        totalDisplay: (Number(order.total || 0) + Number(order.shippingFee || 0)).toLocaleString("vi-VN") + 'đ',
        status: order.status || 'PENDING'
      })).sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    staleTime: 30000,
  });
};

/**
 * Hook for fetching a specific order's details.
 */
export const useOrderDetail = (orderId) => {
  const { t } = useLanguage();
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: async () => {
      const response = await orderApi.getById(orderId);
      const order = response.data || response;
      
      return {
        ...order,
        id: order.orderId || order.id,
        formattedDate: order.orderDate
          ? new Date(order.orderDate).toLocaleString('vi-VN')
          : '',
        grandTotal: Number(order.total || 0) + Number(order.shippingFee || 0),
        subtotal: Number(order.total || 0) // Backend 'total' usually means subtotal in this context
      };
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.paymentMethod === 'BANK' && data?.paymentStatus === 'UNPAID' && data?.status !== 'CANCELLED') {
        return 5000;
      }
      return false;
    },
  });
};
