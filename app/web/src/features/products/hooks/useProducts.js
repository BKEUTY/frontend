import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import productApi from '../services/productService';

export const useProducts = (params = {}) => {
  const {
    size = 20,
    search = '',
    categoryId = null,
    sort = 'default',
    status = 'ACTIVE'
  } = params;


  return useInfiniteQuery({
    queryKey: ['products', 'infinite', { size, search, categoryId, sort, status }],
    queryFn: async ({ pageParam = 1 }) => {
      const trimmedSearch = search ? String(search).trim() : '';
      const apiParams = {
        page: pageParam,
        size,
        status,
      };

      if (trimmedSearch) {
        apiParams.search = trimmedSearch;
      }
      if (categoryId && categoryId !== 'all') {
        apiParams.categoryId = categoryId;
      }
      if (sort !== 'default') {
        apiParams.sort = sort;
      }

      const res = await productApi.getAll(apiParams);
      return {
        items: res.data?.content || [],
        totalPages: res.data?.totalPages || 1,
        totalItems: res.data?.totalElements || 0,
        nextPage: pageParam < res.data?.totalPages ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductsPaginated = (params = {}) => {
  const {
    page = 1,
    size = 20,
    search = '',
    categoryId = null,
    sort = 'default',
    status = 'ACTIVE'
  } = params;

  const query = useQuery({
    queryKey: ['products', 'paginated', { page, size, search, categoryId, sort, status }],
    queryFn: async () => {
      const trimmedSearch = search ? String(search).trim() : '';
      const apiParams = {
        page,
        size,
        status,
      };

      if (trimmedSearch) {
        apiParams.search = trimmedSearch;
      }
      if (categoryId && categoryId !== 'all') {
        apiParams.categoryId = categoryId;
      }
      if (sort !== 'default') {
        apiParams.sort = sort;
      }

      const res = await productApi.getAll(apiParams);
      return {
        items: res.data?.content || [],
        totalPages: res.data?.totalPages || 1,
        totalItems: res.data?.totalElements || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    error: query.error ? (query.error?.response?.data?.message || query.error?.message || 'no_products_found') : null,
  };
};
