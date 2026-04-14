import API from "./api";

export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

export const getProfile = async () => {
  const { data } = await API.get("/users/profile");
  return data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/users/profile", data);
  return res.data;
};
