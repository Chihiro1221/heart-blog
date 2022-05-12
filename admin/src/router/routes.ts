import { RouteRecordRaw } from "vue-router"

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { guest: true },
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/",
    name: "main",
    redirect: { name: "home" },
    meta: { menu: { title: "仪表盘", icon: "fas fa-house-user" } },
    component: () => import("@/layouts/main.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/main/home.vue"),
      },
    ],
  },
] as RouteRecordRaw[]
export default routes
