import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewApi from '../api/reviewApi';

export const useReviews = (variantId, params = {}, options = {}) => {
    const queryClient = useQueryClient();

    const { data: reviewsData, isLoading, isError, refetch } = useQuery({
        queryKey: ['reviews', variantId, params],
        queryFn: async () => {
            const response = await reviewApi.getReviewsByVariantId(variantId, params);
            return response.data;
        },
        enabled: !!variantId && options.enabled !== false,
    });

    const createReviewMutation = useMutation({
        mutationFn: (data) => reviewApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variantId] });
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
        }
    });

    return {
        reviewsData,
        isLoading,
        isError,
        refetch,
        createReview: createReviewMutation.mutateAsync,
        isCreating: createReviewMutation.isPending
    };
};
