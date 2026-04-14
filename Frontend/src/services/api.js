import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// attach token automatically + normalize URL
API.interceptors.request.use((config) => {
  // normalize URL: if it starts with / and not /api, prepend /api
  if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api")) {
    config.url = `/api${config.url}`;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
