import { useState, useCallback } from 'react';
import productApi from '../api/productApi';

export const useProducts = (pageSize = 20) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const fetchProducts = useCallback(async (pageIndex, append, searchTerm, catId, currentSort) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { 
                page: pageIndex, 
                size: pageSize,
                status: 'ACTIVE'
            };

            if (searchTerm) {
                params.name = searchTerm.trim();
            }

            if (catId && catId !== 'all') {
                params.categoryId = catId;
            }
            
            if (currentSort !== 'default') {
                params.sort = currentSort; 
            }

            const res = await productApi.getAll(params);
            const newItems = res.data?.content || [];

            setProducts(prev => append ? [...prev, ...newItems] : newItems);
            setTotalPages(res.data?.totalPages || 1);
            setTotalItems(res.data?.totalElements || 0);

        } catch (err) {
            setError('api_error_fetch_products');
        } finally {
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [pageSize]);

    return { products, isLoading, error, totalPages, totalItems, fetchProducts };
};
