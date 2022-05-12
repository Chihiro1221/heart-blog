<script setup lang="ts"></script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item>
      <router-link to="/">首页</router-link>
    </a-breadcrumb-item>
    <template v-for="(route, index) of $route.matched" :key="index">
      <a-breadcrumb-item v-if="route.meta.menu">
        <router-link :to="route.path" v-if="route.meta.menu">{{ route.meta?.menu?.title }}</router-link>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<style scoped lang="scss"></style>
