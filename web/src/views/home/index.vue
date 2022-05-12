<script setup lang="ts">
import ArticleContainer from '@/layouts/home/articleContainer.vue';
import TipContainer from '@/layouts/home/tipContainer.vue';
import BackTop from '@/components/backTop.vue';
</script>

<template>
  <div class="main-container">
    <!-- 文章内容区域 -->
    <ArticleContainer />
    <!-- 右侧tip区域 -->
    <TipContainer />
    <BackTop />
  </div>
</template>

<style scoped lang="scss"></style>
