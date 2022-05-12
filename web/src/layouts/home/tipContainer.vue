<script setup lang="ts">
import Tips from '@/layouts/home/tips.vue'
import ArticleTips from '@/layouts/home/articleTips.vue'
import TagTips from '@/layouts/home/tagTips.vue'
</script>

<template>
  <section class="tip-container">
    <Tips />
    <ArticleTips />
    <TagTips />
  </section>
</template>

<style scoped lang="scss">
.tip-container {
  @apply col-span-1 hidden md:block;
}
</style>
