import axiosClient from './axiosClient';
import publicAxiosClient from './publicAxiosClient';

const recommendationService = {
  getPersonalizedRecommendations: () => {
    return axiosClient.get('/api/product/recommendations/personalized');
  },

  getRelatedProducts: (productName) => {
    return publicAxiosClient.get('/api/product/recommendations/related', {
      params: { productName }
    });
  }
};

export default recommendationService;
