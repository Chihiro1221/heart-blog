<script setup lang="ts">
import Header from '@/layouts/home/header.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
  <div>
    <Header />
    <suspense>
      <template #fallback>
        <div class="flex m-[auto] w-[1200px]">
          <div class="w-[70%]">
            <el-skeleton animated>
              <template #template>
                <div style="padding: 14px" class="flex flex-col gap-2">
                  <el-skeleton-item class="!h-[50px]" />
                  <el-skeleton-item class="!h-[50px]" />
                  <el-skeleton-item class="!h-[50px]" />
                  <el-skeleton-item class="!h-[50px]" />
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
          </div>
          <div class="flex-1">
            <el-skeleton animated>
              <template #template>
                <div class="flex flex-col gap-2">
                  <el-skeleton-item class="!h-[280px] mt-3" />
                  <el-skeleton-item class="!h-[280px] mt-3" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>
      </template>
      <template #default>
        <div class="home">
          <main>
            <Router-view />
          </main>
        </div>
      </template>
    </suspense>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.home {
  main {
    @apply flex justify-center;
  }
}
</style>
