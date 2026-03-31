<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

import ImageUploadField from "@/components/common/ImageUploadField.vue";
import {
  createBanner,
  fetchBannerDetail,
  updateBanner,
} from "@/api/modules/banners";
import type { BannerItem } from "@/types/admin";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isEdit = computed(() => Boolean(route.params.banner_id));

const form = reactive<BannerItem>({
  banner_id: "",
  title: "",
  subtitle: "",
  image_url: "",
  action_type: "category",
  action_value: "",
  action_text: "",
  sort: 0,
  status: "enabled",
});

async function loadDetail() {
  if (!isEdit.value) {
    return;
  }
  loading.value = true;
  try {
    const data = await fetchBannerDetail(String(route.params.banner_id));
    Object.assign(form, data);
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    if (isEdit.value) {
      await updateBanner(String(route.params.banner_id), form);
      ElMessage.success("轮播图已更新");
    } else {
      await createBanner(form);
      ElMessage.success("轮播图已创建");
    }
    router.push("/banners");
  } finally {
    loading.value = false;
  }
}

onMounted(loadDetail);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">{{ isEdit ? "编辑轮播图" : "新建轮播图" }}</h2>
        <div class="page-subtitle">轮播图会直接影响 miniapp 首页运营位。</div>
      </div>
    </div>

    <div class="page-card form-card" v-loading="loading">
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="轮播图 ID">
            <el-input v-model="form.banner_id" :disabled="isEdit" placeholder="例如 b1" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="form.subtitle" />
          </el-form-item>
          <el-form-item label="按钮文案">
            <el-input v-model="form.action_text" />
          </el-form-item>
          <el-form-item label="跳转类型">
            <el-select v-model="form.action_type">
              <el-option label="分类" value="category" />
              <el-option label="商品" value="goods" />
              <el-option label="无跳转" value="none" />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转值">
            <el-input v-model="form.action_value" placeholder="分类 ID 或商品 ID" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status">
              <el-option label="启用" value="enabled" />
              <el-option label="停用" value="disabled" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="轮播图图片">
          <ImageUploadField v-model="form.image_url" />
        </el-form-item>

        <div class="actions">
          <el-button @click="router.push('/banners')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? "保存修改" : "创建轮播图" }}
          </el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<style scoped>
.form-card {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>
