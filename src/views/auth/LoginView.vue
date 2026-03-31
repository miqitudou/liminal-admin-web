<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

import { loginAdmin } from "@/api/modules/auth";
import { setAccessToken, setAdminName, setAdminUsername } from "@/utils/auth";

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning("请输入账号和密码");
    return;
  }

  loading.value = true;

  try {
    const data = await loginAdmin({
      username: form.username,
      password: form.password,
    });
    setAccessToken(data.access_token);
    setAdminName(data.admin_info.display_name);
    setAdminUsername(data.admin_info.username);
    ElMessage.success("登录成功");
    router.push((route.query.redirect as string) || "/dashboard");
  } catch (error) {
    void error;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-hero">
      <div class="hero-card">
        <div class="hero-kicker">Liminal 后台</div>
        <h1 class="hero-title">从商品、分类到订单流转，统一在这里管理。</h1>
        <p class="hero-desc">
          当前后台已经接入真实的管理员登录接口，下一步会继续把商品、分类、轮播图和订单页面与 backend 完整联通。
        </p>

        <div class="hero-points">
          <div class="hero-point">商品与规格管理</div>
          <div class="hero-point">首页轮播与分类运营</div>
          <div class="hero-point">订单状态与履约跟进</div>
        </div>
      </div>
    </div>

    <div class="login-panel">
      <div class="page-card login-card">
        <div class="login-card-kicker">后台登录</div>
        <h2 class="login-card-title">欢迎回来</h2>
        <p class="login-card-desc">使用管理员账号密码进入运营后台。</p>

        <el-form label-position="top" @submit.prevent="handleLogin">
          <el-form-item label="账号">
            <el-input
              v-model="form.username"
              placeholder="请输入管理员账号"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="请输入密码"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            进入后台
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  background:
    radial-gradient(circle at top left, rgba(201, 120, 73, 0.18), transparent 30%),
    linear-gradient(135deg, #f6efe8 0%, #f3f5f9 50%, #eef2f7 100%);
}

.login-hero,
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.hero-card {
  max-width: 620px;
}

.hero-kicker,
.login-card-kicker {
  color: var(--brand);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-title {
  margin: 18px 0 0;
  font-size: 48px;
  line-height: 1.18;
  letter-spacing: 0.01em;
}

.hero-desc {
  margin: 18px 0 0;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.9;
}

.hero-points {
  margin-top: 32px;
  display: grid;
  gap: 14px;
}

.hero-point {
  width: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(201, 120, 73, 0.18);
  box-shadow: var(--shadow-soft);
}

.login-card {
  width: min(100%, 440px);
  padding: 32px;
}

.login-card-title {
  margin: 14px 0 0;
  font-size: 34px;
}

.login-card-desc {
  margin: 12px 0 28px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.login-button {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 1080px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-hero {
    padding-bottom: 8px;
  }

  .hero-title {
    font-size: 34px;
  }

  .login-panel {
    padding-top: 8px;
  }
}
</style>
