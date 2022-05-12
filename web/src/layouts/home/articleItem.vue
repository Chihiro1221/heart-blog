<script setup lang="ts">
import { IArticle } from '#/responseResult';
import utils from '@/utils';
import ItemTag from '@/components/itemTag.vue';
import ItemAction from '@/components/itemAction.vue';

interface IProp {
  article: IArticle;
}

withDefaults(defineProps<IProp>(), {});
const emit = defineEmits(['like']);
const like = async () => {
  emit('like');
};
</script>

<template>
  <div class="col-span-2 grid overflow-hidden">
    <div class="meta-container">
      <a href="#" class="duration-300 hover:text-violet-500">{{ article.author?.nickname }}</a>
      <div class="stick"></div>
      <span class="text-gray-400 text-[13px]">{{ utils.formatDate(article.createdAt) }}</span>
      <div class="stick"></div>
      <ItemTag class="!hidden md:!flex" :tags="article.tags!" />
    </div>
    <div class="content-container py-2">
      <h2 class="font-bold">
        <span v-if="article.is_stick" class="mr-1 text-violet-500">[置顶]</span>
        {{ article.title }}
      </h2>
      <p class="my-2 content ellipsis-2 text-sm text-gray-500">
        {{ article.content }}
      </p>
    </div>
    <ItemAction :object="article" @like="like" />
  </div>
</template>

<style scoped lang="scss">
.meta-container {
  @apply flex text-[14px] items-center;
}
</style>
