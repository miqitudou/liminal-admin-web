<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import {
  fetchPointsRedemptions,
  updatePointsRedemptionStatus,
} from "@/api/modules/points";
import type { PointsRedemptionItem } from "@/types/admin";

const loading = ref(false);
const actionLoadingId = ref("");
const list = ref<PointsRedemptionItem[]>([]);
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
    const data = await fetchPointsRedemptions({
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

async function changeStatus(row: PointsRedemptionItem, status: string) {
  actionLoadingId.value = row.id;
  try {
    await updatePointsRedemptionStatus(row.id, { status });
    ElMessage.success(status === "fulfilled" ? "已标记为已完成" : "已取消兑换并退回积分");
    await loadData();
  } finally {
    actionLoadingId.value = "";
  }
}

onMounted(loadData);
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">积分兑换记录</h2>
        <div class="page-subtitle">
          查看会员积分兑换情况，并在后台推进发放或取消处理。
        </div>
      </div>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input
          v-model="filters.keyword"
          placeholder="搜索商品、手机号或昵称"
          clearable
        />
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="已完成" value="fulfilled" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column prop="product_title" label="兑换商品" min-width="220" />
        <el-table-column label="会员" min-width="180">
          <template #default="{ row }">
            <div>{{ row.nickname || "微信用户" }}</div>
            <div class="cell-sub">{{ row.mobile || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="points_cost" label="消耗积分" width="110" />
        <el-table-column prop="created_at" label="兑换时间" width="180" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 'fulfilled'
                  ? 'success'
                  : row.status === 'cancelled'
                    ? 'info'
                    : 'warning'
              "
            >
              {{
                row.status === "fulfilled"
                  ? "已完成"
                  : row.status === "cancelled"
                    ? "已取消"
                    : "待处理"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div v-if="row.status === 'pending'" class="action-group">
              <el-button
                link
                type="success"
                :loading="actionLoadingId === row.id"
                @click="changeStatus(row, 'fulfilled')"
              >
                标记完成
              </el-button>
              <el-button
                link
                type="danger"
                :loading="actionLoadingId === row.id"
                @click="changeStatus(row, 'cancelled')"
              >
                取消并退分
              </el-button>
            </div>
            <span v-else class="cell-sub">已处理</span>
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

.cell-sub {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.action-group {
  display: flex;
  gap: 10px;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
