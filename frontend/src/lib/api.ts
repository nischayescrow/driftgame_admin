import axios from "axios";
import AppStore from "../store/store";
import { refreshToken } from "../features/auth/services/auth.service";
import { setUser } from "../features/user/user.slice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL!,
  timeout: 100000,
  withCredentials: true,
});

export default api;

let isRefreshing: boolean = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((req) => {
    error ? req.reject(error) : req.resolve();
  });

  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    console.log(
      error.response ? error.response.status : error.status,
      "originalRequest.url : ",
      originalRequest?.url,
    );

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      (originalRequest?.url.includes("admin/auth/") &&
        originalRequest?.url !== "/admin/auth/verify/me")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => api(originalRequest),
          reject,
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      console.log("We have got 401!!");

      const refresh = await refreshToken();

      console.log("refresh: ", refresh);

      if (!refresh || !refresh.data.access_token) {
        return Promise.reject(error);
      }

      AppStore.dispatch(
        setUser({
          access_token: refresh.data.access_token,
          data: {
            id: refresh.data.user.id,
            first_name: refresh.data.user.first_name,
            last_name: refresh.data.user.last_name,
            email: refresh.data.user.email,
            email_verified: refresh.data.user.email_verified,
            picture: refresh.data.user.picture,
            status: refresh.data.user.status,
          },
        }),
      );

      processQueue(null);

      return api(originalRequest);
    } catch (error) {
      console.log(error);

      processQueue(error);

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
