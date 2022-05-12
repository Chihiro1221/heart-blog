<script lang='ts' setup>
const menus = reactive([
  {
    title: '基本信息',
    path: '/user/info/index'
  },
  {
    title: '修改密码',
    path: '/user/info/password'
  },
  {
    title: '我的收藏',
    path: '/user/info/collection'
  },
  {
    title: '文章管理',
    path: '/user/info/topic'
  },
  {
    title: '回收站',
    path: '/user/info/recycle'
  },
  {
    title: '草稿箱',
    path: '/user/info/draft'
  }
]);
</script>

<template>
  <div class='menu'>
    <router-link v-for='(menu, i) of menus' :key='i'
                 :class='{ active: $route.path === menu.path }' :to='{ path: menu.path }'>
      {{ menu.title }}
    </router-link>
  </div>
</template>

<style lang='scss' scoped>
.menu {
  @apply mt-4 bg-white;
  a {
    @apply px-2 py-3 flex items-center justify-center text-sm hover:bg-violet-500 hover:text-white duration-200 cursor-pointer;
    &.active {
      @apply bg-violet-500 text-white;
    }
  }
}
</style>
