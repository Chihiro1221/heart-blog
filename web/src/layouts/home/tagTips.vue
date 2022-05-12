<script setup lang="ts">
import tagService from '@/composable/tag';
tagService.initTags();
</script>

<template>
  <div class="bg-white mt-4 pb-4 shadow-sm border rounded-sm max-w-[300px]">
    <div class="flex items-center gap-2 border-b py-4 px-4">
      <i class="fa-solid fa-tags"></i>
      <h2 class="text-sm">标签云</h2>
    </div>
    <div class="content p-4">
      <div class="flex gap-2 flex-wrap">
        <el-tag
          @click="$router.push(`/tag/${tag._id}`)"
          class="ml-2 !text-white cursor-pointer"
          :color="tag.color ?? 'black'"
          v-for="tag of tagService.tags.value"
          :key="tag._id"
          >{{ tag.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
