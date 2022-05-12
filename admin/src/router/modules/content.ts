import { RouteRecordRaw } from "vue-router"

export default [
  {
    path: "/content",
    name: "content",
    meta: { menu: { title: "内容管理", icon: "fab fa-dropbox" } },
    redirect: { name: "article" },
    component: () => import("@/layouts/main.vue"),
    children: [
      {
        path: "articles",
        name: "article",
        meta: { menu: { title: "文章管理" }, permission: { page_url: "articles" } },
        component: () => import("@/views/content/article.vue"),
      },
      {
        path: "articles/edit/:id?",
        name: "article-edit",
        props: true,
        meta: { menu: { title: "编辑文章" }, permission: { page_url: "article-edit" } },
        component: () => import("@/views/content/editArticle.vue"),
      },
      {
        path: "categories",
        name: "category",
        meta: { menu: { title: "分类管理" }, permission: { page_url: "categories" } },
        component: () => import("@/views/content/categories.vue"),
      },
      {
        path: "tags",
        name: "tag",
        meta: { menu: { title: "标签管理" }, permission: { page_url: "tags" } },
        component: () => import("@/views/content/tags.vue"),
      },
      {
        path: "album",
        name: "album",
        meta: { menu: { title: "相册管理" }, permission: { page_url: "album" } },
        component: () => import("@/views/content/album.vue"),
      },
    ],
  },
] as RouteRecordRaw[]
