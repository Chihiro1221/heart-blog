<script setup lang="ts">
import { useRoute } from "vue-router"
import { ref, watch } from "vue"
import menuService from "@/composables/menu"
// 菜单收集
const route = useRoute()
const selectedKeys = ref<string[]>([])
watch(
  () => route.path,
  (value) => {
    selectedKeys.value.splice(0, 1, value)
  },
  { immediate: true }
)
</script>
<template>
  <a-layout-sider v-model:collapsed="menuService.collapsed.value" :trigger="null">
    <div class="logo">
      <img src="/images/logo.jpg" alt="" />
    </div>
    <a-menu v-model:selectedKeys="selectedKeys" :theme="menuService.isDark.value ? 'dark' : 'light'" mode="inline">
      <template v-for="(item, index) in menuService.menus.value" :key="index">
        <template v-if="item.children?.length">
          <a-sub-menu :key="item.path">
            <template #icon>
              <i :class="item.icon"></i>
            </template>
            <template #title>{{ item.title }}</template>
            <a-menu-item v-for="citem of item.children" :key="citem?.path">
              <router-link :to="{ name: citem?.name }">{{ citem?.title }}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item :key="item.path" @click="$router.push(item.path)">
            <div :class="menuService.collapsed.value ? '' : 'flex items-center gap-2'">
              <i :class="item.icon"></i>
              <span v-show="!menuService.collapsed.value">{{ item.title }}</span>
            </div>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped lang="scss"></style>
