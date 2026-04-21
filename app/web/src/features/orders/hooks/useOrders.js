import { useLanguage } from '@/store/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import orderApi from '../services/orderService';
import { useMemo } from 'react';

export const useOrders = (page = 1, size = 10, filters = {}) => {
    const { t } = useLanguage();

    const queryParams = useMemo(() => {
        const cleanParams = { 
            page: Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1,
            size: Number.isFinite(Number(size)) ? Math.max(1, Number(size)) : 10,
            ...filters 
        };
        
        Object.keys(cleanParams).forEach((key) => {
            if (cleanParams[key] === null || cleanParams[key] === undefined || cleanParams[key] === '') {
                delete cleanParams[key];
            }
        });

        if (cleanParams.status === 'ALL') delete cleanParams.status;
        if (cleanParams.sort === 'default') delete cleanParams.sort;
        if (cleanParams.search) {
            cleanParams.search = String(cleanParams.search).trim();
        }
        
        return cleanParams;
    }, [page, size, filters]);

    const query = useQuery({
        queryKey: ['myOrders', queryParams],
        queryFn: async () => {
            const response = await orderApi.getHistory(queryParams);

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
                    formattedTotal: (Number(order.total || 0) + Number(order.shippingFee || 0)).toLocaleString("vi-VN") + t('unit_vnd')
                })),
                total: totalElements,
                totalPages: totalPages
            };
        },
        retry: false,
        staleTime: 30000,
    });

    return {
        orders: query.data?.content ?? [],
        total: query.data?.total ?? 0,
        totalPages: query.data?.totalPages ?? 0,
        loading: query.isPending,
        error: query.error ? (query.error?.response?.data?.message || query.error?.message || 'error') : null,
        refetch: query.refetch
    };
};

export const useOrderDetail = (id, options = {}) => {
    return useQuery({
        queryKey: ['orderDetail', id],
        queryFn: async () => {
            const response = await orderApi.getById(id);
            const order = response.data || response;
            return {
                ...order,
                formattedDate: order.orderDate
                    ? new Date(order.orderDate).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : '',
                total: Number(order.total || 0),
                shippingFee: Number(order.shippingFee || 0)
            };
        },
        enabled: !!id,
        refetchInterval: (query) => {
            const data = query.state.data;
            if (data?.paymentMethod === 'BANK' && data?.paymentStatus === 'UNPAID' && data?.status !== 'CANCELLED') {
                return 5000;
            }
            return false;
        },
        ...options,
    });
};

