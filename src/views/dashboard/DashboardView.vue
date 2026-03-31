<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">控制台</h2>
        <div class="page-subtitle">
          第一阶段先提供后台骨架和模块入口，下一步继续接入商品、分类、订单、轮播图的真实接口和表格能力。
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <article class="page-card stat-card">
        <div class="stat-label">当前阶段</div>
        <div class="stat-value">基础框架</div>
        <div class="stat-foot">已搭建登录、布局、路由、菜单、API 占位层</div>
      </article>

      <article class="page-card stat-card">
        <div class="stat-label">优先模块</div>
        <div class="stat-value">分类 / 商品</div>
        <div class="stat-foot">下一步先让商品体系能被完整配置和管理</div>
      </article>

      <article class="page-card stat-card">
        <div class="stat-label">目标联动</div>
        <div class="stat-value">Miniapp + Backend</div>
        <div class="stat-foot">后台字段设计将优先兼容当前小程序的数据结构</div>
      </article>
    </div>

    <div class="page-card roadmap-card">
      <h3>接下来建议的实现节奏</h3>
      <ol>
        <li>分类管理列表与编辑表单</li>
        <li>商品管理列表与商品编辑页</li>
        <li>轮播图管理</li>
        <li>订单列表与详情页</li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  padding: 24px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.stat-value {
  margin-top: 14px;
  font-size: 28px;
  font-weight: 700;
}

.stat-foot {
  margin-top: 12px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.roadmap-card {
  margin-top: 20px;
  padding: 24px;
}

.roadmap-card h3 {
  margin-top: 0;
}

.roadmap-card ol {
  margin: 16px 0 0;
  padding-left: 20px;
  color: var(--text-secondary);
  line-height: 2;
}

@media (max-width: 1080px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
