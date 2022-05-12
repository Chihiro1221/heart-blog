<script setup lang="ts">
import menuService from "@/composables/menu"
</script>

<template>
  <div class="px-[20px] py-4 flex items-center">
    <div
      @click="$router.push({ name: link.name })"
      class="history"
      :class="{ active: link.isActive }"
      v-for="(link, index) of menuService.historyLink.value"
      :key="link.name"
    >
      <span class="close" @click.stop="menuService.removeHistory(link, index)">×</span>
      <span>{{ link.title }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history {
  @apply bg-white rounded-md shadow-md mr-2 py-2 px-4 text-gray-800 hover:bg-violet-600 hover:duration-300 cursor-pointer hover:text-white relative;
  &.active {
    @apply bg-violet-600 text-white;
  }
  .close {
    @apply absolute -top-1 -right-1 bg-gray-700 text-white rounded-full w-[12px] flex h-[12px] text-xs p-1 items-center justify-center hover:bg-white hover:text-gray-700;
  }
}
</style>
