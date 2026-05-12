import axios from "axios";
import { store } from "@/redux/store";

const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("token") ||
    store.getState().auth.currentUser?.token ||
    null
  );
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  Promise.reject
);

axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized (e.g., logout, clear token)
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
