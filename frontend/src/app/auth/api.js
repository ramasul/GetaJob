import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);

        if (!refreshToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token, expires_in } = response.data;

        Cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
          expires: new Date(new Date().getTime() + expires_in * 1000),
          secure: false, //process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
          expires: 7,
          secure: false, //process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        Cookies.remove(ACCESS_TOKEN_COOKIE);
        Cookies.remove(REFRESH_TOKEN_COOKIE);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(identifier, password) {
    const response = await api.post("/auth/login", { identifier, password });
    const { access_token, refresh_token, expires_in } = response.data;

    Cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
      expires: new Date(new Date().getTime() + expires_in * 1000),
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    Cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
      expires: 7,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return response.data;
  },

  async logout() {
    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated() {
    return !!Cookies.get(ACCESS_TOKEN_COOKIE);
  },
};

export default api;
