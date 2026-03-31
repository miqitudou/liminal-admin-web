import http from "@/api/http";
import type { BannerItem, BannerListData } from "@/types/admin";

export interface BannerQuery {
  keyword?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function fetchBanners(params: BannerQuery) {
  return http.get<unknown, BannerListData>("/admin/banners", { params });
}

export function fetchBannerDetail(bannerId: string | number) {
  return http.get<unknown, BannerItem>(`/admin/banners/${bannerId}`);
}

export function createBanner(payload: Partial<BannerItem>) {
  return http.post<unknown, BannerItem>("/admin/banners", payload);
}

export function updateBanner(bannerId: string | number, payload: Partial<BannerItem>) {
  return http.put<unknown, BannerItem>(`/admin/banners/${bannerId}`, payload);
}

export function deleteBanner(bannerId: string | number) {
  return http.delete<unknown, { deleted: boolean }>(`/admin/banners/${bannerId}`);
}
