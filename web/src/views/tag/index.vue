<script setup lang="ts">
import { IArticle, ITag } from '#/responseResult';
import { fetchArticles } from '@/apis/article';
import Tag from '@/components/tag.vue';
import { Status } from '@/enum/statusEnum';
import tagService from '@/composable/tag';
import ArticleItem from '@/layouts/home/articleItem.vue';
import { fetchTag } from '@/apis/tag';

const articles = ref<IArticle[]>([]);
const currentTag = ref<null | number>(null);
const tag = ref<ITag | null>();
const fetch = async () => {
  const { result } = (await fetchArticles({ where: { status: Status.ISSUE, tags: tag.value?._id } })) || {};
  articles.value = result.data;
};
interface IProp {
  id: string;
}
const { id } = withDefaults(defineProps<IProp>(), {});
await tagService.initNaturalTags();
if (id) {
  const { result } = (await fetchTag(id)) || {};
  if (!result) {
    articles.value = [];
  } else {
    tag.value = tagService.naturalTags.value.find((tag) => tag._id === result._id);
    currentTag.value = tagService.naturalTags.value.indexOf(tag.value!);
  }
}
fetch();

const tagChange = (value: ITag, index: number) => {
  currentTag.value = index;
  tag.value = value;
  fetch();
};
const reset = () => {
  currentTag.value = null;
  tag.value = null;
  fetch();
};
const like = () => {
  fetch();
};
</script>

<template>
  <div class="tag">
    <div class="px-4">
      <Tag :current-tag="currentTag" :tags="tagService.naturalTags.value" @change="tagChange" @reset="reset" class="mt-4" />
    </div>
    <div class="mt-5 border-t" v-if="articles.length">
      <div
        @click="$router.push(`/post/${article._id}`)"
        class="mb-0 cursor-pointer hover:bg-gray-50 px-4 duration-300 py-4 border-b grid md:grid-cols-3"
        v-for="article of articles"
        :key="article._id">
        <ArticleItem :article="article" @like="like" />
        <img v-lazy-load="article.cover" class="border w-[250px] h-[150px] object-cover" alt="" />
      </div>
    </div>
    <el-empty v-else description="暂无内容"></el-empty>
  </div>
</template>

<style scoped lang="scss">
.tag {
  @apply w-[1200px] mt-4 bg-white;
}
</style>
