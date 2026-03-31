<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  DataLine,
  Goods,
  Grid,
  List,
  PictureFilled,
} from "@element-plus/icons-vue";

import { adminMenuItems } from "@/constants/menu";

const route = useRoute();
const router = useRouter();

const iconMap = {
  DataLine,
  Goods,
  Grid,
  List,
  PictureFilled,
};

const activePath = computed(() => route.path);

function handleSelect(path: string) {
  router.push(path);
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand-block">
      <div class="brand-mark">LM</div>
      <div>
        <div class="brand-title">Liminal Admin</div>
        <div class="brand-subtitle">小程序运营后台</div>
      </div>
    </div>

    <div class="sidebar-section-title">核心模块</div>

    <el-menu
      :default-active="activePath"
      class="sidebar-menu"
      background-color="transparent"
      text-color="#d6dceb"
      active-text-color="#172033"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in adminMenuItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon>
          <component :is="iconMap[item.icon as keyof typeof iconMap]" />
        </el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 22%),
    var(--sidebar-bg);
  color: var(--sidebar-text);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px 18px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f4d9c4, #c97849);
  color: #172033;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
}

.brand-subtitle {
  margin-top: 4px;
  color: rgba(214, 220, 235, 0.72);
  font-size: 13px;
}

.sidebar-section-title {
  margin: 18px 12px 12px;
  color: rgba(214, 220, 235, 0.64);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar-menu {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
  margin-bottom: 8px;
  border-radius: 14px;
}

:deep(.el-menu-item.is-active) {
  background: var(--sidebar-active);
  font-weight: 600;
}

@media (max-width: 1080px) {
  .sidebar {
    padding-bottom: 12px;
  }
}
</style>
