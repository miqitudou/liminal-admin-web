import http from "@/api/http";
import type {
  PointsProductItem,
  PointsProductListData,
  PointsRedemptionItem,
  PointsRedemptionListData,
} from "@/types/admin";

export interface PointsProductQuery {
  keyword?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface PointsRedemptionQuery {
  keyword?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function fetchPointsProducts(params: PointsProductQuery) {
  return http.get<unknown, PointsProductListData>("/admin/points/products", { params });
}

export function fetchPointsProductDetail(productId: string | number) {
  return http.get<unknown, PointsProductItem>(`/admin/points/products/${productId}`);
}

export function createPointsProduct(payload: Partial<PointsProductItem>) {
  return http.post<unknown, PointsProductItem>("/admin/points/products", payload);
}

export function updatePointsProduct(
  productId: string | number,
  payload: Partial<PointsProductItem>,
) {
  return http.put<unknown, PointsProductItem>(
    `/admin/points/products/${productId}`,
    payload,
  );
}

export function fetchPointsRedemptions(params: PointsRedemptionQuery) {
  return http.get<unknown, PointsRedemptionListData>("/admin/points/redemptions", {
    params,
  });
}

export function updatePointsRedemptionStatus(
  redemptionId: string | number,
  payload: { status: string },
) {
  return http.post<unknown, PointsRedemptionItem>(
    `/admin/points/redemptions/${redemptionId}/status`,
    payload,
  );
}
