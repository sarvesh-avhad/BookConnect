import api from "./api";

export const searchBooks = async (query) => {
    const { data } = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return data;
};

export const getBookDetails = async (bookData) => {
    const { data } = await api.post("/books/details", bookData);
    return data;
};

export const addReview = async (bookId, reviewData) => {
    const { data } = await api.post(`/books/${bookId}/reviews`, reviewData);
    return data;
};

export const getTopBooks = async () => {
    const { data } = await api.get("/books/top");
    return data;
};
