import type { PaginationMeta } from "@/types/api";

export interface AdminInfo {
  id: string;
  username: string;
  display_name: string;
}

export interface AdminLoginData {
  access_token: string;
  token_type: string;
  admin_info: AdminInfo;
}

export interface CategoryItem {
  category_id: string;
  category_name: string;
  category_desc: string;
  badge_text: string;
  delivery_mode: string;
  sort: number;
  status: string;
  goods_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListData {
  list: CategoryItem[];
  pagination: PaginationMeta;
}

export interface GoodsSpecItem {
  spec_id?: string;
  spec_name: string;
  price_cents: number;
  stock: number;
  min_advance_hours: number;
  sort: number;
  status: string;
}

export interface GoodsBookingRuleItem {
  min_advance_hours: number;
  pickup_slots: string[];
}

export interface GoodsListItem {
  goods_id: string;
  category_id: string;
  category_name: string;
  goods_name: string;
  cover_image: string;
  price_cents: number;
  sales_count: number;
  status: string;
  is_recommend: boolean;
  spec_count: number;
  updated_at?: string;
}

export interface GoodsItem {
  goods_id?: string;
  category_id: string;
  category_name?: string;
  goods_name: string;
  goods_desc: string;
  cover_text: string;
  cover_color: string;
  cover_image: string;
  price_cents: number;
  sales_count: number;
  status: string;
  is_recommend: boolean;
  sort: number;
  tags: string[];
  detail_tips: string[];
  specs: GoodsSpecItem[];
  booking_rule: GoodsBookingRuleItem;
}

export interface GoodsListData {
  list: GoodsListItem[];
  pagination: PaginationMeta;
}

export interface BannerItem {
  banner_id?: string;
  title: string;
  subtitle: string;
  image_url: string;
  action_type: string;
  action_value: string;
  action_text: string;
  sort: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface BannerListData {
  list: BannerItem[];
  pagination: PaginationMeta;
}

export interface OrderItemData {
  goods_id: string;
  goods_name: string;
  cover_text: string;
  cover_color: string;
  cover_image: string;
  spec_id: string;
  spec_name: string;
  price_cents: number;
  quantity: number;
  booking_date: string;
  pickup_slot: string;
}

export interface OrderListItem {
  order_no: string;
  status: string;
  payment_status: string;
  amount_cents: number;
  contact_name: string;
  mobile: string;
  booking_date: string;
  pickup_slot: string;
  created_at?: string;
  goods_count: number;
}

export interface OrderDetailData {
  order_no: string;
  status: string;
  payment_status: string;
  amount_cents: number;
  contact_name: string;
  mobile: string;
  booking_date: string;
  pickup_slot: string;
  remark: string;
  pickup_store_name: string;
  pickup_store_address: string;
  pickup_store_phone: string;
  created_at?: string;
  paid_at?: string;
  items: OrderItemData[];
}

export interface OrderListData {
  list: OrderListItem[];
  pagination: PaginationMeta;
}

export interface UploadData {
  file_name: string;
  file_url: string;
  file_key: string;
}

export interface PointsProductItem {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  points_cost: number;
  stock: number;
  sort: number;
  status: string;
  redemption_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PointsProductListData {
  list: PointsProductItem[];
  pagination: PaginationMeta;
}

export interface PointsRedemptionItem {
  id: string;
  user_id: string;
  nickname: string;
  mobile: string;
  product_id: string;
  product_title: string;
  points_cost: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface PointsRedemptionListData {
  list: PointsRedemptionItem[];
  pagination: PaginationMeta;
}
