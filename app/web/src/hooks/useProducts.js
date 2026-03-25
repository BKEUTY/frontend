import { useState, useCallback } from 'react';
import productApi from '../api/productApi';

export const useProducts = (pageSize = 20) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducts = useCallback(async (pageIndex, append, searchTerm, catId, currentSort) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { page: pageIndex, size: pageSize };
            if (searchTerm) params.search = searchTerm; 
            if (catId && catId !== 'all') params.categoryId = catId;

            const res = await productApi.getAll(params);
            const data = res.data || res;
            const rawContent = data.content || [];

            let mappedProducts = rawContent.map(p => ({
                id: p.productId,
                productId: p.productId,
                name: p.variantName,
                price: p.discountPrice ?? p.originPrice ?? 0,
                oldPrice: p.originPrice,
                stockQuantity: p.stock ?? 0,
                image: p.imageUrl,
                originalId: p.productId,
                parentId: p.productId
            }));

            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                mappedProducts = mappedProducts.filter(v => 
                    v.name?.toLowerCase().includes(lowerTerm)
                );
            }

            if (currentSort === 'price_asc') {
                mappedProducts.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'price_desc') {
                mappedProducts.sort((a, b) => b.price - a.price);
            }

            setProducts(prev => append ? [...prev, ...mappedProducts] : mappedProducts);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError('api_error_fetch_products');
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [pageSize]);

    return { products, isLoading, error, totalPages, fetchProducts };
};
