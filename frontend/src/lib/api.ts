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
let UnprotectedPaths = [
  "/admin/auth/login/email",
  "/admin/auth/signup/email",
  "/admin/auth/refresh",
];
let failedQueue: {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((req) => {
    error ? req.reject(error) : req.resolve(token);
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
      UnprotectedPaths.includes(originalRequest?.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((token) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
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
            id: refresh.data.data.id,
            first_name: refresh.data.data.first_name,
            last_name: refresh.data.data.last_name,
            email: refresh.data.data.email,
            email_verified: refresh.data.data.email_verified,
            picture: refresh.data.data.picture,
            status: refresh.data.data.status,
          },
        }),
      );

      processQueue(null);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${refresh.data.access_token}`;
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
