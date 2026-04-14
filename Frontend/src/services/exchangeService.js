import api from "./api";

// send exchange request
export const requestExchange = async (postId, proposedDuration = "", requestNote = "") => {
  const { data } = await api.post("/exchanges/request", { 
    postId, 
    proposedDuration, 
    requestNote 
  });
  return data;
};

// get available books from others (Marketplace)
export const getAvailable = async () => {
  const { data } = await api.get("/exchanges/available");
  return data;
};

// get my shared books and their requests
export const getMyLendings = async () => {
  const { data } = await api.get("/exchanges/my-lendings");
  return data;
};

// get incoming requests (requests received for MY books)
export const getIncoming = async () => {
  const { data } = await api.get("/exchanges/incoming");
  return data;
};

// get outgoing requests (requests I SENT)
export const getOutgoing = async () => {
  const { data } = await api.get("/exchanges/outgoing");
  return data;
};

// accept request
export const acceptExchange = async (id) => {
  const { data } = await api.put(`/exchanges/${id}/accept`);
  return data;
};

// reject request
export const rejectExchange = async (id) => {
  const { data } = await api.post(`/exchanges/${id}/reject`);
  return data;
};

export const confirmExchange = async (id) => {
  const { data } = await api.post(`/exchanges/${id}/confirm`);
  return data;
};
