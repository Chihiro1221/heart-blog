import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/',
  name: 'home',
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: '',
      name: 'home-index',
      component: () => import('@/views/home/index.vue'),
    },
  ],
} as RouteRecordRaw;
