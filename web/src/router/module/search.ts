import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/search',
  name: 'search',
  redirect: { name: 'search-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: '',
      name: 'search-index',
      component: () => import('@/views/search/index.vue'),
    },
  ],
} as RouteRecordRaw;
