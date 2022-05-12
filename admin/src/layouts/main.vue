<script lang="ts" setup>
import Menu from "./main/menu.vue"
import Header from "./main/header.vue"
import menuService from "@/composables/menu"
import HistoryLink from "./main/historyLink.vue"
</script>
<template>
  <a-spin tip="加载中，请稍等..." size="large" :spinning="menuService.isLoading.value">
    <a-layout>
      <Menu />
      <a-layout>
        <Header />
        <HistoryLink />
        <a-layout-content
          :style="$route.name === 'home' ? null : { margin: '0 16px', padding: '0 20px', background: '#fff', minHeight: '280px' }"
        >
          <suspense>
            <template #default>
              <Router-view :key="$route.path" />
            </template>
          </suspense>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<style lang="scss" scoped>
.ant-layout {
  min-height: 100vh;
  .logo {
    width: 100%;
    min-height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ant-layout-header {
    padding: 0 20px !important;
  }
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
