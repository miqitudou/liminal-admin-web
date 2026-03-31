<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadRequestOptions } from "element-plus";

import { uploadImage } from "@/api/modules/upload";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const loading = ref(false);
const imageUrl = computed(() => props.modelValue);

async function handleUpload(options: UploadRequestOptions) {
  const rawFile = options.file as File;
  loading.value = true;
  try {
    const data = await uploadImage(rawFile);
    emit("update:modelValue", data.file_url);
    options.onSuccess?.(data);
  } catch (error) {
    void error;
    options.onError?.({
      name: "UploadError",
      message: "upload failed",
      status: 500,
      method: "POST",
      url: "",
    } as never);
  } finally {
    loading.value = false;
  }
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.warning("请上传图片文件");
  }
  return isImage;
}
</script>

<template>
  <div class="upload-field">
    <el-upload
      class="upload-control"
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      accept="image/*"
    >
      <div v-loading="loading" class="upload-box">
        <img v-if="imageUrl" :src="imageUrl" class="upload-preview" alt="preview" />
        <div v-else class="upload-placeholder">
          <el-icon><Plus /></el-icon>
          <span>上传图片</span>
        </div>
      </div>
    </el-upload>

    <el-input
      :model-value="modelValue"
      placeholder="或直接填写图片 URL"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.upload-field {
  display: grid;
  gap: 12px;
}

.upload-box {
  width: 180px;
  height: 180px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px dashed var(--border-soft);
  background: #f8fafc;
  display: grid;
  place-items: center;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: grid;
  gap: 8px;
  justify-items: center;
  color: var(--text-secondary);
}
</style>
