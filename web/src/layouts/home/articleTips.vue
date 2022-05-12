<script setup lang="ts">
import { fetchArticles } from '@/apis/article';
import utils from '@/utils';
import { Status } from '@/enum/statusEnum';

const { data: articles } = (
  await fetchArticles({
    limit: 5,
    sort: '-createdAt',
    where: { status: Status.ISSUE },
  })
).result;
</script>

<template>
  <div class="i-card">
    <div class="header">
      <i class="fas fa-file-word"></i>
      <h2>最近文章</h2>
    </div>
    <div class="content">
      <div v-for="article of articles" :key="article._id" class="my-2 text-sm cursor-pointer flex items-center justify-between group">
        <router-link :to="`/post/${article._id}`" class="truncate flex-1 mr-4 group-hover:text-violet-500 duration-300">
          {{ article.title }}
        </router-link>
        <span class="text-xs">{{ utils.formatDate(article.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
