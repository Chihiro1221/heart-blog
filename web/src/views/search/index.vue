<script setup lang='ts'>
import { IArticle, ITag } from '#/responseResult';
import Tag from '@/components/tag.vue';
import tagService from '@/composable/tag';
import ArticleItem from '@/layouts/home/articleItem.vue';
import { Status } from '@/enum/statusEnum';
import { fetchArticles } from '@/apis/article';

const articles = ref<IArticle[]>([]);
const search = ref('');
const currentTag = ref<null | number>(null);
const tag = ref<ITag | null>();
tagService.initNaturalTags();
const fetch = async () => {
  const { result } =
  (await fetchArticles({
    where: {
      status: Status.ISSUE,
      title: { $regex: search.value },
      tags: tag.value?._id
    }
  })) || {};
  articles.value = result.data;
};
const tagChange = (value: ITag, index: number) => {
  currentTag.value = index;
  tag.value = value;
  fetch();
};
const reset = () => {
  currentTag.value = null;
  tag.value = null;
  if (!search.value) return (articles.value = []);
  fetch();
};
const inputChange = () => {
  if (!search.value) return (articles.value = []);
  fetch();
};
const like = () => {
  fetch();
};
</script>

<template>
  <div class='search'>
    <div class='flex items-center gap-2'>
      <img class='w-[20px] h-[20px]' src='/images/search.png' alt='' />
      <h2>搜索</h2>
    </div>
    <input placeholder='请输入文章标题搜索' v-model='search' @input='inputChange' type='text' class='search-input' />
    <Tag :current-tag='currentTag' :tags='tagService.naturalTags.value' @change='tagChange' @reset='reset'
         class='mt-4' />
    <div class='mt-5 border-t' v-if='articles.length'>
      <div
        @click='$router.push(`/post/${article._id}`)'
        class='mb-0 cursor-pointer hover:bg-gray-100 px-4 duration-300 py-4 border-b grid md:grid-cols-3'
        v-for='article of articles'
        :key='article._id'>
        <ArticleItem :article='article' @like='like' />
        <img v-lazy-load='article.cover' class='hidden md:block border w-[250px] h-[150px] object-cover' alt='' />
      </div>
    </div>
    <el-empty v-else description='暂无内容'></el-empty>
  </div>
</template>

<style scoped lang='scss'>
.search {
  @apply bg-white w-[1200px] md:p-10 px-4 py-10 mt-4;
  .search-input {
    @apply bg-gray-100 outline-none w-full rounded-3xl px-1 py-2 indent-4 shadow mt-4;
  }
}
</style>
