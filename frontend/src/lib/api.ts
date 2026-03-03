import axios from "axios";
import AppStore from "../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL!,
  timeout: 100000,
  withCredentials: true,
});

export default api;

api.interceptors.request.use(
  (config) => {
    const token = AppStore.getState()?.user?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("We have got 401!!");
    }

    return Promise.reject(error);
  },
);
