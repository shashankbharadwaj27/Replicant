import {axiosInstance} from "./axiosInstance";

export const signupUser = async (userData) => {
  const res = await axiosInstance.post("/auth/signup", userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axiosInstance.post("/auth/login", userData);
  return res.data;
};

export const getProfile = async (username) => {
  const res = await axiosInstance.get(`/users/${username}`);
  return res.data.user;
};

export const toggleFollow = async (usernameToToggle) => {
  const res = await axiosInstance.patch("/users/follow", {
    usernameToToggle,
  });
  return res.data;
};
