<script setup lang="ts">
import dashboardService from "@/composables/dashboard"
</script>

<template>
  <div>
    <a-row class="px-4" :gutter="16">
      <a-col :span="6" v-for="(item, index) of dashboardService.dashboardData.value" :key="index">
        <a-card class="card" :title="item.title" :bordered="false">
          <div>
            <h2>{{ item.desc }}</h2>
            <div class="flex items-center justify-between">
              <h2 class="text-3xl m-0">{{ item.numerical }}</h2>
              <i :style="{ color: item.icon_color }" class="text-3xl" :class="item.icon"></i>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>
