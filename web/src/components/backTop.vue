<script setup lang="ts">
import { RocketOne } from '@icon-park/vue-next';
// 回到顶部
const backTop = () => {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
  <el-tooltip class="box-item" effect="dark" content="回到顶部" placement="top">
    <div
      @click="backTop"
      class="fixed hidden md:flex bg-violet-500 w-[50px] h-[50px] rounded-full right-[320px] bottom-[30px] justify-center items-center text-xl text-white hover:shadow-md hover:bg-violet-600 duration-200 cursor-pointer">
      <component :is="RocketOne" />
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss"></style>
