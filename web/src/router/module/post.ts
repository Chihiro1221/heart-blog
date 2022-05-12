import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/post',
  name: 'post',
  redirect: { name: 'post-index' },
  component: () => import('@/layouts/home.vue'),
  children: [
    {
      path: ':id?',
      name: 'post-index',
      props: true,
      component: () => import('@/views/post/index.vue'),
    },
    {
      path: 'create',
      name: 'post-create',
      meta: { isAuth: true },
      component: () => import('@/views/post/create.vue'),
    },
    {
      path: 'edit/:id',
      name: 'post-edit',
      meta: { isAuth: true },
      props: true,
      component: () => import('@/views/post/create.vue'),
    },
  ],
} as RouteRecordRaw;
