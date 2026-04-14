import api from "./api";

// get public profile + user posts
export const getUserProfile = async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
};

// follow user
export const followUser = async (id) => {
    const { data } = await api.post(`/users/${id}/follow`);
    return data;
};

// unfollow user
export const unfollowUser = async (id) => {
    const { data } = await api.post(`/users/${id}/unfollow`);
    return data;
};

// get recommended users
export const getRecommendedUsers = async () => {
    const { data } = await api.get("/users/recommended");
    return data;
};
