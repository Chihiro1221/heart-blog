<script lang="ts" setup>
import categoryService from '@/composable/category';
import articleService from '@/composable/article';
import router from '@/router';
import { Status } from '@/enum/statusEnum';
import { Fold, CloseBold } from '@element-plus/icons-vue';
import { userStore } from '@/store/user';

const user = userStore();
const isShow = ref(false);

categoryService.initCategory();
const resetArticle = () => {
  articleService.getArticles({ where: { status: Status.ISSUE } });
  articleService.currentTab.value = '';
  categoryService.currentCategory.value = '默认分类';
  router.push('/');
};
</script>

<template>
  <header class="md:h-[60px] flex border-b bg-white shadow md:px-24 px-4 py-2 md:py-0 justify-between">
    <div class="w-[1200px] flex flex-1 items-center flex-wrap">
      <div class="flex-1">
        <img alt="" class="h-[40px] cursor-pointer" src="/images/logo.png" @click="resetArticle" />
      </div>
      <el-icon class="md:!hidden" size="20px" @click="isShow = !isShow">
        <Fold v-if="!isShow" class="md:hidden" />
        <Close-bold v-else />
      </el-icon>
      <div class="menu" :class="{ 'md:!h-full !h-[280px]': isShow, '!h-0 md:!h-full': !isShow }">
        <a ref="a" data-path="/" href="#" @click="resetArticle">首页</a>
        <router-link class="md:!hidden" v-if="!user.isLogin" :to="{ path: '/login' }">登录</router-link>
        <router-link class="md:!hidden" v-else :to="{ path: '/user' }">个人中心</router-link>
        <router-link class="md:!hidden" v-if="user.isLogin" :to="{ path: '/post/create' }">发布文章</router-link>
        <div class="relative group">
          <span @click="resetArticle">分类</span>
          <div
            class="z-[999] absolute rounded-md shadow-sm text-gray-700 text-sm bg-gray-200 bg-opacity-95 group-hover:grid top-14 left-0 hidden">
            <a
              v-for="cate of categoryService.categories.value"
              :key="cate._id"
              class="px-10 border-b border-white last-of-type:border-none py-2 hover:bg-violet-500 hover:text-white duration-200"
              href="#"
              @click.stop="articleService.changeCateArticle(cate)">
              {{ cate.name }}
            </a>
          </div>
        </div>
        <router-link :to="{ name: 'album' }">相册</router-link>
        <router-link :to="{ name: 'blogroll' }">友情链接</router-link>
        <router-link :to="{ name: 'about' }">关于我</router-link>
        <router-link :to="{ name: 'search' }">搜索</router-link>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.menu {
  @apply w-full overflow-hidden md:overflow-visible md:w-auto md:grid grid-flow-col text-center h-full transition-all duration-100;

  > div,
  > a {
    @apply my-2 md:my-0 py-1 md:py-0 px-4 cursor-pointer hover:bg-violet-400 duration-300 flex justify-center items-center hover:text-white;
  }
}

@keyframes hd {
  0% {
    height: auto;
  }
  100% {
    height: 0;
  }
}
</style>
