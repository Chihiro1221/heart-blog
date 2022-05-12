import { RouteRecordRaw } from 'vue-router';
export default {
  path: '/user',
  name: 'user',
  redirect: { name: 'user-info' },
  component: () => import('@/layouts/user.vue'),
  children: [
    {
      path: 'info',
      name: 'user-info',
      meta: { isAuth: true },
      redirect: { name: 'user-info-index' },
      component: () => import('@/views/user/info.vue'),
      children: [
        {
          path: 'index',
          name: 'user-info-index',
          component: () => import('@/views/user/info/index.vue'),
        },
        {
          path: 'password',
          name: 'user-info-password',
          component: () => import('@/views/user/info/password.vue'),
        },
        {
          path: 'collection',
          name: 'user-info-collection',
          component: () => import('@/views/user/info/collection.vue'),
        },
        {
          path: 'topic',
          name: 'user-info-topic',
          component: () => import('@/views/user/info/topic.vue'),
        },
        {
          path: 'recycle',
          name: 'user-info-recycle',
          component: () => import('@/views/user/info/recycle.vue'),
        },
        {
          path: 'draft',
          name: 'user-info-draft',
          component: () => import('@/views/user/info/draft.vue'),
        },
      ],
    },
    {
      path: ':id',
      name: 'user-desc',
      props: true,
      component: () => import('@/views/user/description.vue'),
    },
  ],
} as RouteRecordRaw;
