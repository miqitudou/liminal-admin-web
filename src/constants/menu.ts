import type { MenuItem } from "@/types/menu";

export const adminMenuItems: MenuItem[] = [
  {
    label: "控制台",
    path: "/dashboard",
    icon: "DataLine",
  },
  {
    label: "商品管理",
    path: "/goods",
    icon: "Goods",
  },
  {
    label: "分类管理",
    path: "/categories",
    icon: "Grid",
  },
  {
    label: "订单管理",
    path: "/orders",
    icon: "List",
  },
  {
    label: "轮播图管理",
    path: "/banners",
    icon: "PictureFilled",
  },
];
