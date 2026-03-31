<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

import {
  createCategory,
  fetchCategories,
  updateCategory,
} from "@/api/modules/categories";
import type { CategoryItem } from "@/types/admin";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isEdit = computed(() => Boolean(route.params.category_id));

const form = reactive<CategoryItem>({
  category_id: "",
  category_name: "",
  category_desc: "",
  badge_text: "",
  delivery_mode: "local",
  sort: 0,
  status: "enabled",
  goods_count: 0,
});

async function loadDetail() {
  if (!isEdit.value) {
    return;
  }
  loading.value = true;
  try {
    const data = await fetchCategories({
      page: 1,
      page_size: 100,
    });
    const matched = data.list.find(
      (item) => item.category_id === String(route.params.category_id),
    );
    if (matched) {
      Object.assign(form, matched);
    }
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    if (isEdit.value) {
      await updateCategory(String(route.params.category_id), form);
      ElMessage.success("分类已更新");
    } else {
      await createCategory(form);
      ElMessage.success("分类已创建");
    }
    router.push("/categories");
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
        <h2 class="page-title">{{ isEdit ? "编辑分类" : "新建分类" }}</h2>
        <div class="page-subtitle">保持分类 ID 稳定，方便后续与 miniapp 配置保持映射。</div>
      </div>
    </div>

    <div class="page-card form-card" v-loading="loading">
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="分类 ID">
            <el-input
              v-model="form.category_id"
              :disabled="isEdit"
              placeholder="例如 cake"
            />
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="form.category_name" />
          </el-form-item>
          <el-form-item label="标签文案">
            <el-input v-model="form.badge_text" />
          </el-form-item>
          <el-form-item label="配送模式">
            <el-select v-model="form.delivery_mode">
              <el-option label="同城" value="local" />
              <el-option label="快递" value="express" />
            </el-select>
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

        <el-form-item label="分类描述">
          <el-input v-model="form.category_desc" type="textarea" :rows="4" />
        </el-form-item>

        <div class="actions">
          <el-button @click="router.push('/categories')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? "保存修改" : "创建分类" }}
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
