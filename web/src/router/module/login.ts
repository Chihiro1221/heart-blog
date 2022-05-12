import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/',
  name: 'login',
  redirect: { name: 'login' },
  component: () => import('@/layouts/auth.vue'),
  children: [
    {
      path: 'login',
      name: 'login',
      meta: { guest: true },
      component: () => import('@/views/auth/login.vue'),
    },
    {
      path: 'registry',
      name: 'registry',
      component: () => import('@/views/auth/registry.vue'),
    },
    {
      path: 'forget-password',
      name: 'forget-password',
      component: () => import('@/views/auth/forget-password.vue'),
    },
  ],
} as RouteRecordRaw;
