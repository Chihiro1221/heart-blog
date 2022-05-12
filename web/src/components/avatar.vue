<script setup lang="ts">
import { IUser } from '#/responseResult';

interface IProp {
  user: IUser;
  className?: string;
}

withDefaults(defineProps<IProp>(), {});
</script>

<template>
  <div :class="className">
    <img v-if="user?.avatar" :src="user?.avatar" alt="" />
    <div v-else-if="user.nickname" class="w-full h-full flex justify-center items-center text-xl rounded-full bg-violet-500 text-white">
      {{ user?.nickname[0] }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
