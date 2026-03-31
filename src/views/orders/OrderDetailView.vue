<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

import { fetchOrderDetail, updateOrderStatus } from "@/api/modules/orders";
import type { OrderDetailData } from "@/types/admin";
import { centsToYuan } from "@/utils/price";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formLoading = ref(false);
const order = ref<OrderDetailData | null>(null);
const nextStatus = ref("pending_payment");

const statusOptions = [
  { label: "待支付", value: "pending_payment" },
  { label: "已支付", value: "paid" },
  { label: "制作中", value: "baking" },
  { label: "待取货", value: "ready_pickup" },
  { label: "已完成", value: "finished" },
  { label: "已取消", value: "cancelled" },
];

const orderNo = computed(() => String(route.params.order_no));

async function loadData() {
  loading.value = true;
  try {
    const data = await fetchOrderDetail(orderNo.value);
    order.value = data;
    nextStatus.value = data.status;
  } finally {
    loading.value = false;
  }
}

async function handleUpdateStatus() {
  formLoading.value = true;
  try {
    const data = await updateOrderStatus(orderNo.value, { status: nextStatus.value });
    order.value = data;
    ElMessage.success("订单状态已更新");
  } finally {
    formLoading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <section v-loading="loading">
    <div class="page-header">
      <div>
        <h2 class="page-title">订单详情</h2>
        <div class="page-subtitle">订单号：{{ order?.order_no || orderNo }}</div>
      </div>
      <el-button @click="router.push('/orders')">返回列表</el-button>
    </div>

    <div v-if="order" class="detail-grid">
      <div class="page-card detail-card">
        <h3>基础信息</h3>
        <div class="detail-list">
          <div><span>订单号</span><strong>{{ order.order_no }}</strong></div>
          <div><span>状态</span><strong>{{ order.status }}</strong></div>
          <div><span>支付状态</span><strong>{{ order.payment_status }}</strong></div>
          <div><span>联系人</span><strong>{{ order.contact_name }}</strong></div>
          <div><span>手机号</span><strong>{{ order.mobile }}</strong></div>
          <div><span>预约日期</span><strong>{{ order.booking_date }}</strong></div>
          <div><span>提货时段</span><strong>{{ order.pickup_slot }}</strong></div>
          <div><span>订单金额</span><strong>¥{{ centsToYuan(order.amount_cents) }}</strong></div>
        </div>
      </div>

      <div class="page-card detail-card">
        <h3>状态流转</h3>
        <div class="status-form">
          <el-select v-model="nextStatus">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" :loading="formLoading" @click="handleUpdateStatus">
            更新状态
          </el-button>
        </div>
        <div class="store-block">
          <div>提货门店：{{ order.pickup_store_name }}</div>
          <div>门店电话：{{ order.pickup_store_phone }}</div>
          <div>门店地址：{{ order.pickup_store_address }}</div>
          <div>备注：{{ order.remark || "无" }}</div>
        </div>
      </div>
    </div>

    <div v-if="order" class="page-card items-card">
      <h3>商品明细</h3>
      <el-table :data="order.items" border>
        <el-table-column label="商品" min-width="220">
          <template #default="{ row }">
            <div class="goods-cell">
              <img :src="row.cover_image" class="goods-thumb" alt="goods" />
              <div>
                <div class="goods-name">{{ row.goods_name }}</div>
                <div class="goods-meta">{{ row.spec_name }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120">
          <template #default="{ row }">¥{{ centsToYuan(row.price_cents) }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="booking_date" label="预约日期" width="120" />
        <el-table-column prop="pickup_slot" label="提货时段" width="140" />
      </el-table>
    </div>
  </section>
</template>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.detail-card,
.items-card {
  padding: 24px;
}

.detail-list {
  display: grid;
  gap: 14px;
}

.detail-list div,
.store-block div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef1f5;
}

.status-form {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.store-block {
  display: grid;
  gap: 12px;
}

.items-card {
  margin-top: 18px;
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
</style>
