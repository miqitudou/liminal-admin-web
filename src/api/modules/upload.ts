import http from "@/api/http";
import type { UploadData } from "@/types/admin";

export async function uploadImage(file: File): Promise<UploadData> {
  const formData = new FormData();
  formData.append("file", file);
  return http.post<FormData, UploadData>("/admin/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
