<script setup lang="ts">
import ArticleItem from '@/layouts/home/articleItem.vue';
import articleService from '@/composable/article';
import categoryService from '@/composable/category';
import { Status } from '@/enum/statusEnum';

const currentPage = ref(1);
const pageSize = ref(10);
const pageSizes = ref([10, 50, 100, 200]);

const changeTab = async (item: { value: string; name: string }) => {
  const sort = item.value ? '-' + item.value : item.value;
  await articleService.getArticles({ sort, where: { status: Status.ISSUE } });
  articleService.changeTag(item);
};

const fetch = async () => {
  await articleService.getArticles({
    where: { status: [Status.ISSUE] },
    sort: '-stick',
    limit: pageSize.value,
    page: currentPage.value,
  });
};
const pageSizeChange = (size: number) => {
  pageSize.value = size;
  fetch();
};
const currentPageChange = (current: number) => {
  currentPage.value = current;
  fetch();
};
const like = () => {
  fetch();
};
</script>

<template>
  <section class="article-container">
    <div class="hot px-4 flex justify-between">
      <div class="flex items-center">
        <div class="flex items-center" v-for="(item, index) of articleService.tags" :key="index" href="#">
          <span :class="{ active: articleService.currentTab.value === item.value }" @click="changeTab(item)" class="cursor-pointer">{{
            item.name
          }}</span>
          <div class="stick"></div>
        </div>
      </div>
      <div class="text-right text-[16px] text-violet-600 font-bold">{{ categoryService.currentCategory.value }}</div>
    </div>
    <div v-if="articleService.articles.value.length">
      <div
        @click="$router.push(`/post/${article._id}`)"
        class="item-container"
        v-for="article of articleService.articles.value"
        :key="article._id">
        <ArticleItem :article="article" @like="like" />
        <div class="hidden md:flex max-w-[250px] self-end px-4">
          <img v-lazy-load="article.cover" class="border w-[250px] h-[150px] object-cover" alt="" />
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无文章" />
    <div class="flex items-center mt-8 justify-center">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        background
        layout="total, sizes, prev, pager, next"
        :total="articleService.total.value"
        @size-change="pageSizeChange"
        @current-change="currentPageChange" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.article-container {
  @apply bg-white md:col-span-3 shadow-sm py-4 min-h-[800px] border;

  .hot {
    @apply flex items-center border-b text-[14px] pb-3 gap-2;
    > div {
      > div {
        @apply hover:text-violet-500 duration-300;
      }
    }
  }

  .item-container {
    @apply mb-0 cursor-pointer hover:bg-gray-100 px-4 duration-300 py-4 border-b grid md:grid-cols-3;

    &:last-of-type {
      @apply border-none;
    }
  }
}
</style>
