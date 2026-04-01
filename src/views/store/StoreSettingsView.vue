<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import ImageUploadField from "@/components/common/ImageUploadField.vue";
import { fetchStoreConfig, updateStoreConfig } from "@/api/modules/store";
import type { StoreConfigItem } from "@/types/admin";

const loading = ref(false);

const form = reactive<StoreConfigItem>({
  id: "",
  store_name: "",
  short_name: "",
  phone: "",
  business_hours: "",
  address: "",
  pickup_notice: "",
  xiaohongshu_qr_url: "",
  wechat_qr_url: "",
  douyin_qr_url: "",
});

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchStoreConfig();
    Object.assign(form, data);
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  try {
    await updateStoreConfig({
      store_name: form.store_name,
      short_name: form.short_name,
      phone: form.phone,
      business_hours: form.business_hours,
      address: form.address,
      pickup_notice: form.pickup_notice,
      xiaohongshu_qr_url: form.xiaohongshu_qr_url,
      wechat_qr_url: form.wechat_qr_url,
      douyin_qr_url: form.douyin_qr_url,
    });
    ElMessage.success("门店配置已更新");
    await loadData();
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">门店配置</h2>
        <div class="page-subtitle">
          维护门店基础信息，以及小程序首页展示的 3 个社媒二维码。
        </div>
      </div>
    </div>

    <div class="page-card form-card" v-loading="loading">
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="门店名称">
            <el-input v-model="form.store_name" />
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="form.short_name" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="营业时间">
            <el-input v-model="form.business_hours" placeholder="例如 09:00-20:00" />
          </el-form-item>
        </div>

        <el-form-item label="门店地址">
          <el-input v-model="form.address" />
        </el-form-item>

        <el-form-item label="取货说明">
          <el-input v-model="form.pickup_notice" type="textarea" :rows="4" />
        </el-form-item>

        <div class="qr-grid">
          <el-form-item label="小红书二维码">
            <ImageUploadField v-model="form.xiaohongshu_qr_url" />
          </el-form-item>
          <el-form-item label="微信二维码">
            <ImageUploadField v-model="form.wechat_qr_url" />
          </el-form-item>
          <el-form-item label="抖音二维码">
            <ImageUploadField v-model="form.douyin_qr_url" />
          </el-form-item>
        </div>

        <div class="actions">
          <el-button type="primary" @click="handleSubmit">保存配置</el-button>
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

.qr-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

@media (max-width: 1200px) {
  .qr-grid {
    grid-template-columns: 1fr;
  }
}
</style>
