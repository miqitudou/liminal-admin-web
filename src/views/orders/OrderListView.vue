<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { fetchOrders } from "@/api/modules/orders";
import type { OrderListItem } from "@/types/admin";
import { centsToYuan } from "@/utils/price";

const router = useRouter();
const loading = ref(false);
const list = ref<OrderListItem[]>([]);
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0,
});
const filters = reactive({
  order_no: "",
  status: "",
  mobile: "",
});

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchOrders({
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
        <h2 class="page-title">订单管理</h2>
        <div class="page-subtitle">查看订单、跟进状态流转，并为后续 miniapp 正式切换做好履约支撑。</div>
      </div>
    </div>

    <div class="page-card table-card">
      <div class="toolbar">
        <el-input v-model="filters.order_no" placeholder="订单号" clearable />
        <el-input v-model="filters.mobile" placeholder="手机号" clearable />
        <el-select v-model="filters.status" placeholder="状态" clearable>
          <el-option label="待支付" value="pending_payment" />
          <el-option label="已支付" value="paid" />
          <el-option label="制作中" value="baking" />
          <el-option label="待取货" value="ready_pickup" />
          <el-option label="已完成" value="finished" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button type="primary" @click="loadData">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="list" border>
        <el-table-column prop="order_no" label="订单号" min-width="200" />
        <el-table-column prop="contact_name" label="联系人" width="120" />
        <el-table-column prop="mobile" label="手机号" width="140" />
        <el-table-column prop="booking_date" label="预约日期" width="120" />
        <el-table-column prop="pickup_slot" label="提货时段" width="140" />
        <el-table-column label="金额" width="120">
          <template #default="{ row }">¥{{ centsToYuan(row.amount_cents) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/orders/${row.order_no}`)">
              详情
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
  grid-template-columns: 1.2fr 1fr 180px 100px;
  gap: 12px;
  margin-bottom: 16px;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
