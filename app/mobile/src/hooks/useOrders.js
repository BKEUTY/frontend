import { useState, useCallback } from 'react';
import orderApi from '../api/orderApi';
import { useLanguage } from '../i18n/LanguageContext';
import { showToast } from '../utils/ToastService';

export const useOrders = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await orderApi.getHistory();
            if (response.data) {
                const mappedOrders = response.data.map(order => ({
                    ...order,
                    id: order.orderId,
                    date: order.orderDate,
                    totalDisplay: order.total ? order.total.toLocaleString("vi-VN") + 'đ' : '0đ',
                    status: (order.paymentMethod === 'Banking' && !order.qrCodeLink) ? 'COMPLETED' : 'PENDING'
                }));
                mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(mappedOrders);
            }
        } catch (error) {
            console.error(error);
            showToast(t('error'), 'error', t('api_error_order_history'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [t]);

    return {
        orders,
        loading,
        refreshing,
        setRefreshing,
        fetchOrders
    };
};
