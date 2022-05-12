<script setup lang="ts">
import { onMounted } from "vue"
import { initData } from "./echartsOption"
onMounted(async () => {
  echarts.init(document.querySelector("#echarts1")!).setOption(await initData())
})
</script>

<template>
  <div class="card">
    <div id="echarts1" style="max-height: 320px; height: 257px"></div>
  </div>
</template>

<style scoped></style>
