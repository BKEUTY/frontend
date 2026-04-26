import axiosClient from './axiosClient';

const chatbotApi = {
    sendMessage: (data) => {
        return axiosClient.post('/api/chatbot/send', data);
    },
    getHistory: (sessionId) => {
        return axiosClient.get(`/api/chatbot/history/${sessionId}`);
    }
};

export default chatbotApi;
