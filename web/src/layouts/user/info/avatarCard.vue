<script setup lang='ts'>
import utils from '@/utils';
import { IUser } from '#/responseResult';
import Avatar from '@/components/avatar.vue';

interface IProp {
  user: IUser;
}

withDefaults(defineProps<IProp>(), {});
</script>

<template>
  <div class='avatar-container bg-white overflow-hidden flex justify-center py-10 flex-col gap-2 items-center'>
    <!-- <img class="object-cover" :src="user?.avatar" /> -->
    <Avatar :user='user' className='avatar-card' />
    <h2 class='font-bold mt-2'>{{ user?.nickname }}</h2>
    <div class='text-sm text-gray-700 text-center'>
      <div>注册于：</div>
      <div>{{ utils.formatDate(user?.createdAt) }}</div>
    </div>
  </div>
</template>

<style scoped lang='scss'></style>
