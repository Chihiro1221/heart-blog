<script setup lang='ts'>
import Header from '@/layouts/home/header.vue';
import Footer from '@/components/footer.vue';
</script>

<template>
  <Header />
  <suspense>
    <div class='home'>
      <main>
        <Router-view />
      </main>
    </div>
  </suspense>
  <Footer />
</template>

<style scoped lang='scss'>
.home {
  main {
    @apply flex justify-center;
  }
}
</style>
