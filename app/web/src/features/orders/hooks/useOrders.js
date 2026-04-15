import { useQuery } from '@tanstack/react-query';
import orderApi from '../services/orderService';

export const useOrders = (page = 1, size = 10, filters = {}) => {
    const normalizedPage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
    const normalizedSize = Number.isFinite(Number(size)) ? Math.max(1, Number(size)) : 10;

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['myOrders', normalizedPage, normalizedSize, filters],
        queryFn: async () => {
            const sanitizedFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value !== null && value !== undefined && value !== '')
            );

            const response = await orderApi.getHistory({
                page: normalizedPage,
                size: normalizedSize,
                ...sanitizedFilters
            });

            const rawData = response.data;
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
        totalPages: data?.totalPages ?? 0,
        loading: isPending,
        error,
        refetch
    };
};

