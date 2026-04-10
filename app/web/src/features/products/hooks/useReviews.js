import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reviewApi from '../services/reviewService';

export const useReviews = (variantId, params = {}, options = {}) => {
    const queryClient = useQueryClient();

    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ['reviews-stats', variantId],
        queryFn: async () => {
            const response = await reviewApi.getStatsByVariantId(variantId);
            return response.data;
        },
        enabled: !!variantId && options.fetchStats !== false,
    });

    const { data: reviewsData, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ['reviews', variantId, params],
        queryFn: async () => {
            const response = await reviewApi.getReviewsByVariantId(variantId, params);
            return response.data;
        },
        enabled: !!variantId && options.enabled !== false,
    });

    const createReviewMutation = useMutation({
        mutationFn: (data) => reviewApi.create(data, { skipGlobalErrorHandler: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews-stats'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
        }
    });

    const updateReviewMutation = useMutation({
        mutationFn: ({ id, data }) => reviewApi.update(id, data, { skipGlobalErrorHandler: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews-stats'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
        }
    });

    const deleteReviewMutation = useMutation({
        mutationFn: (id) => reviewApi.delete(id, { skipGlobalErrorHandler: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['reviews-stats'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
        }
    });

    const uploadImageMutation = useMutation({
        mutationFn: (formData) => reviewApi.uploadImage(formData)
    });

    return {
        reviewsData,
        isLoading: isLoading || isFetching,
        isError,
        statsData,
        isStatsLoading,
        refetch,
        createReview: createReviewMutation.mutateAsync,
        isCreating: createReviewMutation.isPending,
        updateReview: updateReviewMutation.mutateAsync,
        isUpdating: updateReviewMutation.isPending,
        deleteReview: deleteReviewMutation.mutateAsync,
        isDeleting: deleteReviewMutation.isPending,
        uploadImage: uploadImageMutation.mutateAsync,
        isUploadingImage: uploadImageMutation.isPending
    };
};
