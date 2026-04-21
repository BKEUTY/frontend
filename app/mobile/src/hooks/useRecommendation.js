import { useQuery } from '@tanstack/react-query';
import recommendationApi from '../api/recommendationApi';

export const usePersonalizedRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations', 'personalized'],
    queryFn: async () => {
      const response = await recommendationApi.getPersonalized();
      return response.data || response;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useRelatedProducts = (productName) => {
  return useQuery({
    queryKey: ['recommendations', 'related', productName],
    queryFn: async () => {
      if (!productName) return null;
      const response = await recommendationApi.getRelated(productName);
      return response.data || response;
    },
    enabled: !!productName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
