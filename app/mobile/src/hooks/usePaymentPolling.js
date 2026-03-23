import { useState, useEffect, useRef } from 'react';
import paymentApi from '../api/paymentApi';

export const usePaymentPolling = (orderId, interval = 5000) => {
    const [isPaid, setIsPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const checkStatus = async () => {
        if (!orderId) return;
        setIsLoading(true);
        try {
            const res = await paymentApi.checkStatus(orderId);
            if (res.data?.status === 'PAID') {
                setIsPaid(true);
                stopPolling();
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const startPolling = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(checkStatus, interval);
    };

    const stopPolling = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (orderId && !isPaid) {
            startPolling();
        }
        return () => stopPolling();
    }, [orderId, isPaid]);

    return { isPaid, isLoading, error, checkManual: checkStatus };
};
