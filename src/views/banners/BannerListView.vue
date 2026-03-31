<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

import { deleteBanner, fetchBanners } from "@/api/modules/banners";
import type { BannerItem } from "@/types/admin";
import { showSuccess } from "@/utils/message";

const router = useRouter();
const loading = ref(false);
const list = ref<BannerItem[]>([]);
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
});
const filters = reactive({
  keyword: "",
  status: "",
});

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchBanners({
      ...filters,
      page: pagination.page,
      page_size: pagination.page_size,
    });
    list.value = data.list;
    pagination.total = data.pagination.total;
  } finally {
    loading.value = false;
  }
}

async function handleDelete(row: BannerItem) {
  await ElMessageBox.confirm(`确定删除轮播图「${row.title}」吗？`, "删除轮播图", {
    type: "warning",
  });
  await deleteBanner(String(row.banner_id));
  showSuccess("轮播图已删除");
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">轮播图管理</h2>
        <div class="page-subtitle">维护首页 Banner 的图片、文案、跳转目标和排序。</div>
      </div>
      <el-button type="primary" @click="router.push('/banners/create')">新建轮播图</el-button>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input v-model="filters.keyword" placeholder="搜索标题" clearable />
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column label="图片" width="120">
          <template #default="{ row }">
            <img :src="row.image_url" class="banner-thumb" alt="banner" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="action_type" label="跳转类型" width="120" />
        <el-table-column prop="action_value" label="跳转值" min-width="180" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/banners/${row.banner_id}/edit`)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.page_size"
          layout="total, prev, pager, next"
          :total="pagination.total"
          @current-change="loadData"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.table-card {
  padding: 20px;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr 160px 100px;
  gap: 12px;
  margin-bottom: 16px;
}

.banner-thumb {
  width: 80px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
