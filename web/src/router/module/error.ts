import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/error',
  name: 'error',
  component: () => import('@/layouts/error.vue'),
  redirect: { name: 'error-404' },
  children: [
    {
      path: '404',
      name: 'error-404',
      // @ts-ignore
      component: () => import('@/views/error/404.vue'),
    },
  ],
} as RouteRecordRaw;
