import http from "@/api/http";
import type { AdminLoginData } from "@/types/admin";

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export function loginAdmin(payload: AdminLoginPayload) {
  return http.post<AdminLoginPayload, AdminLoginData>("/admin/auth/login", payload);
}

export function logoutAdmin() {
  return Promise.resolve();
}
