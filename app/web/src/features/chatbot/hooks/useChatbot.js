import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import chatbotService from '../services/chatbotService';

export const useChatHistory = (sessionId, isEnabled = true) => {
    return useQuery({
        queryKey: ['chatbot', 'history', sessionId],
        queryFn: () => chatbotService.getHistory(sessionId).then(res => res.data),
        enabled: !!sessionId && isEnabled,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => chatbotService.sendMessage(data),
        onMutate: async (newMessage) => {
            await queryClient.cancelQueries({ queryKey: ['chatbot', 'history', newMessage.sessionId] });
            const previousHistory = queryClient.getQueryData(['chatbot', 'history', newMessage.sessionId]);

            queryClient.setQueryData(['chatbot', 'history', newMessage.sessionId], (old) => {
                const optimisticMsg = {
                    id: Date.now(),
                    sender: 'user',
                    content: newMessage.message,
                    timestamp: new Date().toISOString(),
                    recommendedProduct: []
                };
                return old ? [...old, optimisticMsg] : [optimisticMsg];
            });

            return { previousHistory };
        },
        onSuccess: (response, variables) => {
            queryClient.setQueryData(['chatbot', 'history', variables.sessionId], (old) => {
                const aiMsg = {
                    id: `ai_${Date.now()}`,
                    sender: 'ai',
                    content: response.data.response,
                    timestamp: new Date().toISOString(),
                    recommendedProduct: response.data.recommendedProduct || []
                };
                return old ? [...old, aiMsg] : [aiMsg];
            });
        },
        onError: (err, variables, context) => {
            if (context?.previousHistory) {
                queryClient.setQueryData(['chatbot', 'history', variables.sessionId], context.previousHistory);
            }
        }
    });
};
