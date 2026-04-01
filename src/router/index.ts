import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/auth/LoginView.vue";
import BannerFormView from "@/views/banners/BannerFormView.vue";
import BannerListView from "@/views/banners/BannerListView.vue";
import CategoryFormView from "@/views/categories/CategoryFormView.vue";
import CategoryListView from "@/views/categories/CategoryListView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";
import GoodsFormView from "@/views/goods/GoodsFormView.vue";
import GoodsListView from "@/views/goods/GoodsListView.vue";
import OrderDetailView from "@/views/orders/OrderDetailView.vue";
import OrderListView from "@/views/orders/OrderListView.vue";
import PointsProductFormView from "@/views/points/PointsProductFormView.vue";
import PointsProductListView from "@/views/points/PointsProductListView.vue";
import PointsRedemptionListView from "@/views/points/PointsRedemptionListView.vue";
import StoreSettingsView from "@/views/store/StoreSettingsView.vue";
import { isAuthenticated } from "@/utils/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      title: "登录",
      public: true,
    },
  },
  {
    path: "/",
    component: AdminLayout,
    redirect: "/dashboard",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardView,
        meta: {
          title: "控制台",
        },
      },
      {
        path: "goods",
        name: "goods",
        component: GoodsListView,
        meta: {
          title: "商品管理",
        },
      },
      {
        path: "goods/create",
        name: "goods-create",
        component: GoodsFormView,
        meta: {
          title: "新建商品",
        },
      },
      {
        path: "goods/:goods_id/edit",
        name: "goods-edit",
        component: GoodsFormView,
        meta: {
          title: "编辑商品",
        },
      },
      {
        path: "categories",
        name: "categories",
        component: CategoryListView,
        meta: {
          title: "分类管理",
        },
      },
      {
        path: "categories/create",
        name: "categories-create",
        component: CategoryFormView,
        meta: {
          title: "新建分类",
        },
      },
      {
        path: "categories/:category_id/edit",
        name: "categories-edit",
        component: CategoryFormView,
        meta: {
          title: "编辑分类",
        },
      },
      {
        path: "orders",
        name: "orders",
        component: OrderListView,
        meta: {
          title: "订单管理",
        },
      },
      {
        path: "orders/:order_no",
        name: "orders-detail",
        component: OrderDetailView,
        meta: {
          title: "订单详情",
        },
      },
      {
        path: "banners",
        name: "banners",
        component: BannerListView,
        meta: {
          title: "轮播图管理",
        },
      },
      {
        path: "banners/create",
        name: "banners-create",
        component: BannerFormView,
        meta: {
          title: "新建轮播图",
        },
      },
      {
        path: "banners/:banner_id/edit",
        name: "banners-edit",
        component: BannerFormView,
        meta: {
          title: "编辑轮播图",
        },
      },
      {
        path: "store-settings",
        name: "store-settings",
        component: StoreSettingsView,
        meta: {
          title: "门店配置",
        },
      },
      {
        path: "points-products",
        name: "points-products",
        component: PointsProductListView,
        meta: {
          title: "积分商品",
        },
      },
      {
        path: "points-products/create",
        name: "points-products-create",
        component: PointsProductFormView,
        meta: {
          title: "新建积分商品",
        },
      },
      {
        path: "points-products/:product_id/edit",
        name: "points-products-edit",
        component: PointsProductFormView,
        meta: {
          title: "编辑积分商品",
        },
      },
      {
        path: "points-redemptions",
        name: "points-redemptions",
        component: PointsRedemptionListView,
        meta: {
          title: "积分兑换记录",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  document.title = `${String(to.meta.title || "Liminal Admin")} - Liminal Admin`;

  if (to.meta.public) {
    if (to.path === "/login" && isAuthenticated()) {
      return "/dashboard";
    }
    return true;
  }

  if (!isAuthenticated()) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

export default router;
