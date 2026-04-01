import http from "@/api/http";
import type { StoreConfigItem } from "@/types/admin";

export function fetchStoreConfig() {
  return http.get<unknown, StoreConfigItem>("/admin/store");
}

export function updateStoreConfig(payload: Partial<StoreConfigItem>) {
  return http.put<unknown, StoreConfigItem>("/admin/store", payload);
}
