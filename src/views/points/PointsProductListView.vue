<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { fetchPointsProducts } from "@/api/modules/points";
import type { PointsProductItem } from "@/types/admin";

const router = useRouter();
const loading = ref(false);
const list = ref<PointsProductItem[]>([]);
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
    const data = await fetchPointsProducts({
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

onMounted(loadData);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">积分商品</h2>
        <div class="page-subtitle">
          维护积分商城可兑换的商品、库存、所需积分与上下架状态。
        </div>
      </div>
      <el-button type="primary" @click="router.push('/points-products/create')">
        新建积分商品
      </el-button>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input v-model="filters.keyword" placeholder="搜索积分商品名称" clearable />
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="启用" value="enabled" />
          <el-option label="停用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column label="商品" min-width="260">
          <template #default="{ row }">
            <div class="product-cell">
              <img :src="row.image_url" class="product-thumb" alt="points-product" />
              <div>
                <div class="product-title">{{ row.title }}</div>
                <div class="product-subtitle">{{ row.subtitle || "积分兑换商品" }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="points_cost" label="所需积分" width="120" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="redemption_count" label="已兑换" width="100" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'">
              {{ row.status === "enabled" ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="router.push(`/points-products/${row.id}/edit`)"
            >
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
  grid-template-columns: 1.6fr 180px 100px;
  gap: 12px;
  margin-bottom: 16px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumb {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  background: #f5f6fa;
}

.product-title {
  font-weight: 700;
}

.product-subtitle {
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
