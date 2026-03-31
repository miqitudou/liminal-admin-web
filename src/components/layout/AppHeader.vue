<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowDown, SwitchButton } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

import { clearAuthState, getAdminName } from "@/utils/auth";

defineProps<{
  title: string;
}>();

const router = useRouter();
const adminName = getAdminName();

async function handleLogout() {
  await ElMessageBox.confirm("确定退出当前后台账号吗？", "退出登录", {
    type: "warning",
  });

  clearAuthState();
  ElMessage.success("已退出登录");
  router.push("/login");
}
</script>

<template>
  <header class="header page-card">
    <div>
      <div class="header-kicker">Liminal 烘焙管理后台</div>
      <h1 class="header-title">{{ title }}</h1>
    </div>

    <div class="header-actions">
      <el-tag type="warning" effect="light" round>第一阶段骨架</el-tag>
      <el-dropdown trigger="click" @command="handleLogout">
        <div class="account-entry">
          <div class="account-avatar">{{ adminName.slice(0, 1) }}</div>
          <div class="account-copy">
            <div class="account-name">{{ adminName }}</div>
            <div class="account-role">超级管理员</div>
          </div>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.header {
  margin: 24px 28px 0;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-kicker {
  color: var(--brand);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.header-title {
  margin: 10px 0 0;
  font-size: 28px;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.account-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 16px;
  cursor: pointer;
  background: #f7f8fc;
  border: 1px solid var(--border-soft);
}

.account-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #c97849, #f0d5c2);
  color: #ffffff;
  font-weight: 700;
}

.account-copy {
  min-width: 90px;
}

.account-name {
  font-size: 14px;
  font-weight: 700;
}

.account-role {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 1080px) {
  .header {
    margin: 12px 12px 0;
    padding: 16px;
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
