import { ElMessage } from "element-plus";

export function showSuccess(message: string) {
  ElMessage.success(message);
}

export function showError(message: string) {
  ElMessage.error(message);
}
