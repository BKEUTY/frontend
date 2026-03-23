import { useState, useCallback } from 'react';
import productApi from '../api/productApi';
import { generateSlug } from '../utils/helpers';

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
            const data = res.data;
            const rawContent = data.content || [];

            const detailPromises = rawContent.map(p => productApi.getById(p.id));
            const detailResponses = await Promise.all(detailPromises);

            let flattenedVariants = [];

            detailResponses.forEach((detailRes, index) => {
                const productDetail = detailRes.data;
                const parentData = rawContent[index];

                if (productDetail && productDetail.variants && productDetail.variants.length > 0) {
                    productDetail.variants.forEach(v => {
                        const displayName = v.productVariantName || productDetail.name;
                        flattenedVariants.push({
                            ...parentData,
                            ...v,
                            id: generateSlug(displayName, productDetail.id, v.id),
                            originalId: v.id,
                            parentId: productDetail.id,
                            name: displayName,
                            price: Number(v.price) || 0,
                            minPrice: Number(v.price) || 0,
                            stockQuantity: Number(v.stockQuantity) || 0,
                            image: v.productImageUrl || productDetail.image || parentData.image,
                            categories: productDetail.categories || parentData.categories || []
                        });
                    });
                } else {
                    flattenedVariants.push({
                        ...parentData,
                        id: generateSlug(parentData.name, parentData.id, 0),
                        originalId: parentData.id,
                        parentId: parentData.id,
                        name: parentData.name,
                        price: Number(parentData.minPrice) || 0,
                        minPrice: Number(parentData.minPrice) || 0,
                        stockQuantity: 0,
                        image: parentData.image,
                        categories: parentData.categories || [],
                        isParentOnly: true
                    });
                }
            });

            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                flattenedVariants = flattenedVariants.filter(v =>
                    v.name.toLowerCase().includes(lowerTerm)
                );
            }

            if (catId && catId !== 'all') {
                flattenedVariants = flattenedVariants.filter(v => {
                    if (!v.categories || v.categories.length === 0) return false;
                    return v.categories.some(c =>
                        c.id === catId || c.categoryId === catId || c === catId || c.categoryName === catId || c.id?.toString() === catId?.toString()
                    );
                });
            }

            if (currentSort === 'price_asc') {
                flattenedVariants.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'price_desc') {
                flattenedVariants.sort((a, b) => b.price - a.price);
            }

            setProducts(prev => append ? [...prev, ...flattenedVariants] : flattenedVariants);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError('api_error_fetch_products');
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    return { products, isLoading, error, totalPages, fetchProducts };
};
