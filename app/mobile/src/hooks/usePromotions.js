import { useState, useCallback } from 'react';
import promotionApi from '../api/promotionApi';
import { useLanguage } from '../i18n/LanguageContext';

export const usePromotions = (pageSize = 30) => {
    const { t } = useLanguage();
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });

    const fetchPromotions = useCallback(async (pageIndex = 0, append = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { page: pageIndex, size: pageSize };
            const res = await promotionApi.getAll(params);
            const data = res.data;
            const content = data.content || [];

            setPromotions(prev => append ? [...prev, ...content] : content);
            setPagination({
                current: (data.number || 0) + 1,
                total: data.totalElements || 0,
                totalPages: data.totalPages || 0
            });
        } catch (err) {
            setError('api_error_general');
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    return { promotions, isLoading, error, pagination, fetchPromotions };
};
