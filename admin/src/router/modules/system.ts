import { RouteRecordRaw } from 'vue-router'
export default [
  {
    path: '/system',
    name: 'system',
    redirect: { name: 'menu' },
    meta: { menu: { title: '系统管理', icon: 'fab fa-chromecast' } },
    component: () => import('@/layouts/main.vue'),
    children: [
      {
        path: 'menus',
        name: 'menu',
        meta: { menu: { title: '菜单管理' }, permission: { page_url: 'menus' } },
        component: () => import('@/views/system/menu.vue'),
      },
      {
        path: 'roles',
        name: 'role',
        meta: { menu: { title: '角色管理' }, permission: { page_url: 'roles' } },
        component: () => import('@/views/system/role.vue'),
      },
      {
        path: 'users',
        name: 'user',
        meta: { menu: { title: '用户管理' }, permission: { page_url: 'users' } },
        component: () => import('@/views/system/user.vue'),
      },
    ],
  },
] as RouteRecordRaw[]
