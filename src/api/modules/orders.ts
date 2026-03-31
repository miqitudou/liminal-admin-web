import http from "@/api/http";
import type { OrderDetailData, OrderListData } from "@/types/admin";

export interface OrderQuery {
  order_no?: string;
  status?: string;
  mobile?: string;
  booking_date?: string;
  page?: number;
  page_size?: number;
}

export function fetchOrders(params: OrderQuery) {
  return http.get<unknown, OrderListData>("/admin/orders", { params });
}

export function fetchOrderDetail(orderNo: string) {
  return http.get<unknown, OrderDetailData>(`/admin/orders/${orderNo}`);
}

export function updateOrderStatus(
  orderNo: string,
  payload: { status: string; remark?: string },
) {
  return http.post<unknown, OrderDetailData>(`/admin/orders/${orderNo}/status`, payload);
}
