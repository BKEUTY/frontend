import { useEffect, useCallback } from 'react';
import paymentApi from '../api/paymentApi';

export const usePaymentPolling = (orderId, isPolling, onSuccess) => {
    const checkPaymentStatus = useCallback(async () => {
        if (!orderId) return false;
        try {
            const response = await paymentApi.checkStatus(orderId);
            const resData = response.data || response;
            if (resData && resData.success === true) {
                if (onSuccess) onSuccess();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }, [orderId, onSuccess]);

    useEffect(() => {
        let interval;
        if (isPolling && orderId) {
            interval = setInterval(async () => {
                const isPaid = await checkPaymentStatus();
                if (isPaid) clearInterval(interval);
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPolling, orderId, checkPaymentStatus]);

    return { checkPaymentStatus };
};
