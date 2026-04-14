import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../services/userService';

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userApi.getProfile();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useUserAddresses = () => {
    return useQuery({
        queryKey: ['userAddresses'],
        queryFn: async () => {
            const response = await userApi.getAddresses();
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => userApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, config }) => userApi.addAddress(data, config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, config }) => userApi.deleteAddress(data, config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
        },
    });
};
