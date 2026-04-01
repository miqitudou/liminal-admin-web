<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

import ImageUploadField from "@/components/common/ImageUploadField.vue";
import {
  createPointsProduct,
  fetchPointsProductDetail,
  updatePointsProduct,
} from "@/api/modules/points";
import type { PointsProductItem } from "@/types/admin";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const isEdit = computed(() => Boolean(route.params.product_id));

const form = reactive<PointsProductItem>({
  id: "",
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  points_cost: 0,
  stock: 0,
  sort: 0,
  status: "enabled",
});

async function loadDetail() {
  if (!isEdit.value) {
    return;
  }

  loading.value = true;
  try {
    const data = await fetchPointsProductDetail(String(route.params.product_id));
    Object.assign(form, data);
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      image_url: form.image_url,
      points_cost: form.points_cost,
      stock: form.stock,
      sort: form.sort,
      status: form.status,
    };

    if (isEdit.value) {
      await updatePointsProduct(String(route.params.product_id), payload);
      ElMessage.success("积分商品已更新");
    } else {
      await createPointsProduct(payload);
      ElMessage.success("积分商品已创建");
    }

    router.push("/points-products");
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
        <h2 class="page-title">{{ isEdit ? "编辑积分商品" : "新建积分商品" }}</h2>
        <div class="page-subtitle">
          这里配置积分商城展示信息、所需积分、库存与上下架状态。
        </div>
      </div>
    </div>

    <div class="page-card form-card" v-loading="loading">
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="商品标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="form.subtitle" placeholder="例如 热门兑换 / 下午茶" />
          </el-form-item>
          <el-form-item label="所需积分">
            <el-input-number v-model="form.points_cost" :min="0" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number v-model="form.stock" :min="0" />
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

        <el-form-item label="商品描述">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>

        <el-form-item label="商品图片">
          <ImageUploadField v-model="form.image_url" />
        </el-form-item>

        <div class="actions">
          <el-button @click="router.push('/points-products')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? "保存修改" : "创建积分商品" }}
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
