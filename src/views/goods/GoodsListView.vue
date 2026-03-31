<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { fetchCategories } from "@/api/modules/categories";
import { fetchGoods } from "@/api/modules/goods";
import type { CategoryItem, GoodsListItem } from "@/types/admin";
import { centsToYuan } from "@/utils/price";

const router = useRouter();
const loading = ref(false);
const list = ref<GoodsListItem[]>([]);
const categories = ref<CategoryItem[]>([]);
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
});
const filters = reactive({
  keyword: "",
  category_id: "",
  status: "",
});

async function loadCategories() {
  const data = await fetchCategories({
    page: 1,
    page_size: 100,
  });
  categories.value = data.list;
}

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchGoods({
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

onMounted(async () => {
  await loadCategories();
  await loadData();
});
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">商品管理</h2>
        <div class="page-subtitle">维护商品基础信息、规格、库存、预约规则和上下架状态。</div>
      </div>
      <el-button type="primary" @click="router.push('/goods/create')">新建商品</el-button>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input v-model="filters.keyword" placeholder="搜索商品名称" clearable />
        <el-select v-model="filters.category_id" placeholder="分类" clearable>
          <el-option
            v-for="item in categories"
            :key="item.category_id"
            :label="item.category_name"
            :value="item.category_id"
          />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="上架" value="on" />
          <el-option label="下架" value="off" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column label="商品" min-width="220">
          <template #default="{ row }">
            <div class="goods-cell">
              <img :src="row.cover_image" class="goods-thumb" alt="goods" />
              <div>
                <div class="goods-name">{{ row.goods_name }}</div>
                <div class="goods-meta">{{ row.category_name }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120">
          <template #default="{ row }">¥{{ centsToYuan(row.price_cents) }}</template>
        </el-table-column>
        <el-table-column prop="sales_count" label="销量" width="100" />
        <el-table-column prop="spec_count" label="规格数" width="100" />
        <el-table-column label="推荐" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_recommend ? 'warning' : 'info'">
              {{ row.is_recommend ? "推荐" : "普通" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/goods/${row.goods_id}/edit`)">
              编辑
            </el-button>
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
  grid-template-columns: 1.4fr 180px 140px 100px;
  gap: 12px;
  margin-bottom: 16px;
}

.goods-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.goods-thumb {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  object-fit: cover;
}

.goods-name {
  font-weight: 700;
}

.goods-meta {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 13px;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
