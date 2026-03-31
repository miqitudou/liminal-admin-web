import axios from "axios";
import { ElMessage } from "element-plus";

import { clearAuthState, getAccessToken } from "@/utils/auth";
import type { ApiResponse } from "@/types/api";

const http = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  ((response: any) => {
    const payload = response.data as ApiResponse<unknown>;

    if (payload?.code !== 200) {
      ElMessage.error(payload?.message || "请求失败");
      return Promise.reject(payload);
    }

    return payload.data;
  }) as never,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthState();
      window.location.href = "/login";
    } else {
      ElMessage.error(error.response?.data?.message || error.message || "请求失败");
    }

    return Promise.reject(error);
  },
);

export default http;
