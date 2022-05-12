import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/about',
  name: 'about',
  redirect: { name: 'about-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: '',
      name: 'about-index',
      component: () => import('@/views/about/index.vue'),
    },
  ],
} as RouteRecordRaw;
