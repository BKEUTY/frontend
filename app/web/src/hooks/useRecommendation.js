import { useQuery } from '@tanstack/react-query';
import recommendationService from '@/services/recommendationService';

export const usePersonalizedRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations', 'personalized'],
    queryFn: async () => {
      const response = await recommendationService.getPersonalizedRecommendations();
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useRelatedProducts = (productName) => {
  return useQuery({
    queryKey: ['recommendations', 'related', productName],
    queryFn: async () => {
      if (!productName) return null;
      const response = await recommendationService.getRelatedProducts(productName);
      return response.data;
    },
    enabled: !!productName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
