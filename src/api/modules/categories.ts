import http from "@/api/http";
import type { CategoryItem, CategoryListData } from "@/types/admin";

export interface CategoryQuery {
  keyword?: string;
  status?: string;
  delivery_mode?: string;
  page?: number;
  page_size?: number;
}

export function fetchCategories(params: CategoryQuery) {
  return http.get<unknown, CategoryListData>("/admin/categories", { params });
}

export function fetchCategoryOptions() {
  return http.get<unknown, CategoryListData>("/admin/categories", {
    params: {
      page: 1,
      page_size: 100,
    },
  });
}

export function createCategory(payload: Partial<CategoryItem>) {
  return http.post<unknown, CategoryItem>("/admin/categories", payload);
}

export function updateCategory(categoryId: string, payload: Partial<CategoryItem>) {
  return http.put<unknown, CategoryItem>(`/admin/categories/${categoryId}`, payload);
}

export function deleteCategory(categoryId: string) {
  return http.delete<unknown, { deleted: boolean }>(`/admin/categories/${categoryId}`);
}
