import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/album',
  name: 'album',
  redirect: { name: 'album-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: '',
      name: 'album-index',
      component: () => import('@/views/album/index.vue'),
    },
  ],
} as RouteRecordRaw;
