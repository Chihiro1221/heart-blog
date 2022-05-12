<script setup lang="ts">
import AvatarCard from '@/layouts/user/info/avatarCard.vue';
import ActionMenu from '@/layouts/user/info/actionMenu.vue';
import { userStore } from '@/store/user';

const user = userStore();
</script>

<template>
  <div class="info-container">
    <div class="aside">
      <AvatarCard :user="user.profile!" />
      <ActionMenu />
    </div>
    <div class="content">
      <suspense>
        <template #fallback>
          <el-skeleton animated>
            <template #template>
              <div style="padding: 14px" class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <el-skeleton-item class="!h-[30px]" style="width: 20%" />
                  <el-skeleton-item variant="button" />
                </div>
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
                <el-skeleton-item class="!h-[50px]" />
              </div>
            </template>
          </el-skeleton>
        </template>
        <template #default>
          <Router-view />
        </template>
      </suspense>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-container {
  @apply p-4 w-[1200px] md:grid md:gap-4;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto;

  .content {
    @apply bg-white md:mt-0 mt-4;
  }
}
</style>
