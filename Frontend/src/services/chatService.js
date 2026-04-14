import api from "./api";

export const getRecentChats = async () => {
    const response = await api.get("/chat/recent");
    return response.data;
};

export const getMessages = async (userId) => {
    const response = await api.get(`/chat/${userId}`);
    return response.data;
};

export const sendMessage = async (userId, text) => {
    const response = await api.post(`/chat/${userId}`, { text });
    return response.data;
};
