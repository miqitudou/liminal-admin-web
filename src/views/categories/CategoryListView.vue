<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

import {
  deleteCategory,
  fetchCategories,
} from "@/api/modules/categories";
import type { CategoryItem } from "@/types/admin";
import { showSuccess } from "@/utils/message";

const router = useRouter();
const loading = ref(false);
const list = ref<CategoryItem[]>([]);
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
});
const filters = reactive({
  keyword: "",
  status: "",
  delivery_mode: "",
});

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchCategories({
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

function handleCreate() {
  router.push("/categories/create");
}

function handleEdit(row: CategoryItem) {
  router.push(`/categories/${row.category_id}/edit`);
}

async function handleDelete(row: CategoryItem) {
  await ElMessageBox.confirm(`确定删除分类「${row.category_name}」吗？`, "删除分类", {
    type: "warning",
  });
  await deleteCategory(row.category_id);
  showSuccess("分类已删除");
  await loadData();
}

onMounted(loadData);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">分类管理</h2>
        <div class="page-subtitle">维护 miniapp 的商品分类、配送模式和展示排序。</div>
      </div>
      <el-button type="primary" @click="handleCreate">新建分类</el-button>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input v-model="filters.keyword" placeholder="搜索分类名称" clearable />
        <el-select v-model="filters.delivery_mode" placeholder="配送模式" clearable>
          <el-option label="同城" value="local" />
          <el-option label="快递" value="express" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column prop="category_name" label="分类名称" min-width="180" />
        <el-table-column prop="badge_text" label="标签" width="120" />
        <el-table-column prop="delivery_mode" label="配送模式" width="120" />
        <el-table-column prop="goods_count" label="商品数" width="100" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
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
  grid-template-columns: 1.4fr 180px 160px 100px;
  gap: 12px;
  margin-bottom: 16px;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
