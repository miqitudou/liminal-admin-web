import http from "@/api/http";
import type { GoodsItem, GoodsListData } from "@/types/admin";

export interface GoodsQuery {
  keyword?: string;
  category_id?: string | number;
  status?: string;
  is_recommend?: boolean;
  page?: number;
  page_size?: number;
}

export function fetchGoods(params: GoodsQuery) {
  return http.get<unknown, GoodsListData>("/admin/goods", { params });
}

export function fetchGoodsDetail(goodsId: string | number) {
  return http.get<unknown, GoodsItem>(`/admin/goods/${goodsId}`);
}

export function createGoods(payload: Partial<GoodsItem>) {
  return http.post<unknown, GoodsItem>("/admin/goods", payload);
}

export function updateGoods(goodsId: string | number, payload: Partial<GoodsItem>) {
  return http.put<unknown, GoodsItem>(`/admin/goods/${goodsId}`, payload);
}
