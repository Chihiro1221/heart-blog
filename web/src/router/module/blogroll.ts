import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/blogroll',
  name: 'blogroll',
  redirect: { name: 'blogroll-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: '',
      name: 'blogroll-index',
      component: () => import('@/views/blogroll/index.vue'),
    },
  ],
} as RouteRecordRaw;
