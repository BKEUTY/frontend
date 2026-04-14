import { useState, useCallback } from 'react';
import promotionApi from '../api/promotionApi';
import { useLanguage } from '../i18n/LanguageContext';

export const usePromotions = (pageSize = 30) => {
    const { t } = useLanguage();
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, total: 0 });

    const fetchPromotions = useCallback(async (params = {}, append = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const queryParams = { 
                page: params.page || 1, 
                size: params.size || pageSize,
                search: params.search || '',
                status: params.status && params.status !== 'all' ? params.status : ''
            };
            const res = await promotionApi.getAll(queryParams);
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
