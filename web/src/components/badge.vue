<script setup lang='ts'>
interface IProp {
  color?: string;
}

withDefaults(defineProps<IProp>(), {
  color: 'rgb(139 92 246 / var(--tw-bg-opacity))',
});
</script>

<template>
  <div class='badge'>
    <div class='w-[5px] h-[5px] rounded-full shadow' :style='{backgroundColor:color}'></div>
    <slot />
  </div>
</template>

<style scoped lang='scss'>
.badge {
  @apply flex items-center gap-2;
}
</style>
