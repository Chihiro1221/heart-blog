import { RouteRecordRaw } from 'vue-router';
export default [
  {
    path: '/:any(.*)',
    redirect: { name: 'error-404' },
  },
] as RouteRecordRaw[];
