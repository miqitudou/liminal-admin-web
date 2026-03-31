<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";

const route = useRoute();

const pageTitle = computed(() => String(route.meta.title || "控制台"));
</script>

<template>
  <div class="admin-shell">
    <AppSidebar />
    <div class="admin-main">
      <AppHeader :title="pageTitle" />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px 1fr;
  background:
    radial-gradient(circle at top left, rgba(201, 120, 73, 0.12), transparent 30%),
    linear-gradient(180deg, #f8f9fc 0%, #f2f4f8 100%);
}

.admin-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-content {
  padding: 24px 28px 28px;
}

@media (max-width: 1080px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }
}
</style>
