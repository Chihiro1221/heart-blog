import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/tag',
  name: 'tag',
  redirect: { name: 'tag-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: ':id?',
      name: 'tag-index',
      props: true,
      component: () => import('@/views/tag/index.vue'),
    },
  ],
} as RouteRecordRaw;
