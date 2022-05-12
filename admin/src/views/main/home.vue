<script setup lang="ts">
import Panel from "@/layouts/main/panel.vue"
import Dynamic from "@/layouts/main/dynamic.vue"
import Echarts from "@/layouts/main/echarts.vue"
</script>

<template>
  <Panel />
  <a-row class="p-4" :gutter="16">
    <a-col :span="12">
      <Dynamic />
    </a-col>
    <a-col :span="12">
      <Echarts />
    </a-col>
  </a-row>
  <Icp class="mt-14" />
</template>
<style lang="scss" scoped></style>
