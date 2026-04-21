import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';

/**
 * Mobile hook for products with infinite scroll support.
 */
export const useProducts = (params = {}) => {
  const {
    pageSize = 20,
    searchTerm = '',
    categoryId = null,
    sort = 'default'
  } = params;

  return useInfiniteQuery({
    queryKey: ['products', 'infinite', { pageSize, searchTerm, categoryId, sort }],
    queryFn: async ({ pageParam = 1 }) => {
      const trimmedSearch = typeof searchTerm === 'string' ? searchTerm.trim() : '';
      const apiParams = {
        page: pageParam,
        size: pageSize,
        ...(trimmedSearch && { name: trimmedSearch }),
        ...(categoryId && categoryId !== 'all' && { categoryId }),
        ...(sort !== 'default' && { sort }),
      };

      const res = await productApi.getAll(apiParams);
      const data = res.data || res;
      const rawContent = data.content || [];

      let mappedProducts = rawContent.map(p => ({
        id: p.productId,
        productId: p.productId,
        name: p.variantName,
        price: p.discountPrice ?? p.originPrice ?? 0,
        oldPrice: p.originPrice,
        hasDiscount: (p.discountPrice && p.originPrice) ? p.discountPrice < p.originPrice : false,
        stockQuantity: p.stockQuantity ?? 0,
        sold: p.sold ?? 0,
        brand: p.brand,
        categories: p.categories,
        image: p.imageUrl,
        averageRating: p.averageRating ?? 0,
        ratingCount: p.reviewCount ?? 0
      }));

      return {
        items: mappedProducts,
        totalPages: data.totalPages || 1,
        totalItems: data.totalElements || 0,
        nextPage: pageParam < data.totalPages ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

/**
 * Mobile hook for products with standard pagination (useful for home sections).
 */
export const useProductsPaginated = (params = {}) => {
  const {
    page = 1,
    size = 20,
    searchTerm = '',
    categoryId = null,
    sort = 'default'
  } = params;

  return useQuery({
    queryKey: ['products', 'paginated', { page, size, searchTerm, categoryId, sort }],
    queryFn: async () => {
      const trimmedSearch = typeof searchTerm === 'string' ? searchTerm.trim() : '';
      const apiParams = {
        page,
        size,
        ...(trimmedSearch && { name: trimmedSearch }),
        ...(categoryId && categoryId !== 'all' && { categoryId }),
        ...(sort !== 'default' && { sort }),
      };

      const res = await productApi.getAll(apiParams);
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
        averageRating: p.averageRating ?? 0,
        ratingCount: p.ratingCount ?? 0
      }));

      return {
        items: mappedProducts,
        totalPages: data.totalPages || 1,
        totalItems: data.totalElements || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
