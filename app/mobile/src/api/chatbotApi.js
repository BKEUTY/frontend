import axiosClient from './axiosClient';

const chatbotApi = {
    sendMessage: (data) => {
        return axiosClient.post('/api/chatbot/send', data);
    },
    getHistory: (sessionId, page = 0, size = 20) => {
        return axiosClient.get(`/api/chatbot/history/${sessionId}`, { params: { page, size } });
    }
};

export default chatbotApi;
