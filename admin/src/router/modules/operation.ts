import { RouteRecordRaw } from "vue-router"

export default [
    {
        path: "/operation",
        name: "operation",
        meta: { menu: { title: "网站运营", icon: "fas fa-sitemap" } },
        redirect: { name: "blogroll" },
        component: () => import("@/layouts/main.vue"),
        children: [
            {
                path: "blogroll",
                name: "blogroll",
                meta: { menu: { title: "友情链接" }, permission: { page_url: "blogroll" } },
                component: () => import("@/views/operation/blogroll.vue"),
            },
        ],
    },
] as RouteRecordRaw[]
