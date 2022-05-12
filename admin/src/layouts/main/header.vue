<script setup lang="ts">
import BreadCrumb from "./breadCrumb.vue"
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  FullscreenOutlined,
  MailOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue"
import menuService from "@/composables/menu"
import { authStore } from "@/store/auth"
import { utils } from "@/utils"
import { computed, ref } from "vue"

const userStore = authStore()
const activeKey = ref<string>("1")
const fullScreenState = ref<boolean>(false)
const messageCount = ref<number>(2)
const avatarVisible = ref<boolean>(false)

const fullScreen = () => {
  utils.fullScreen(fullScreenState)
}
</script>

<template>
  <a-layout-header style="background: #fff; padding: 0">
    <div class="flex gap-4 items-center justify-between">
      <div class="flex items-center gap-4">
        <menu-unfold-outlined v-if="menuService.collapsed.value" class="trigger" @click="menuService.toggle()" />
        <menu-fold-outlined v-else class="trigger" @click="menuService.toggle()" />
        <i class="fas fa-moon cursor-pointer" v-if="!menuService.isDark.value" @click="menuService.toggleTheme()"></i>
        <i class="fas fa-sun cursor-pointer" v-else @click="menuService.toggleTheme()"></i>
        <BreadCrumb />
      </div>
      <div class="profile flex items-center" v-if="userStore.profile">
        <a-popover placement="bottom" trigger="click">
          <template #content>
            <a-tabs class="max-w-[350px]" size="small" v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="系统消息">
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
              </a-tab-pane>
              <a-tab-pane key="2" tab="站内消息" force-render>
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
                <p class="truncate message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis?</p>
              </a-tab-pane>
            </a-tabs>
          </template>
          <a-tooltip title="消息">
            <div class="mr-6 flex items-center cursor-pointer">
              <a-badge :count="messageCount">
                <mail-outlined style="font-size: 18px" />
              </a-badge>
            </div>
          </a-tooltip>
        </a-popover>
        <a-tooltip title="全屏" @click="fullScreen">
          <fullscreen-outlined v-if="!fullScreenState" class="icon" />
          <fullscreen-exit-outlined v-else class="icon" />
        </a-tooltip>
        <a-tooltip title="设置">
          <a-dropdown :trigger="['click']" placement="bottomCenter">
            <div class="ant-dropdown-link" @click.prevent>
              <setting-outlined class="icon" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item class="menu-item">
                  <a href="javascript:;">系统设置</a>
                </a-menu-item>
                <a-menu-item class="menu-item">
                  <a href="javascript:;">页面设置</a>
                </a-menu-item>
                <a-menu-item class="menu-item" @click="utils.auth.logout()">
                  <a href="javascript:;">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-tooltip>
        <div class="avatar cursor-pointer" @click="avatarVisible = !avatarVisible">
          <img v-if="userStore.profile?.avatar" :src="userStore.profile?.avatar" alt="头像" />
          <!-- <div v-else class="photo">{{ userStore.profile?.nickname[0]?.toUpperCase() }}</div> -->
          <a-modal
            :closable="false"
            class="max-w-[400px] max-h-[400px]"
            cancelText="编辑用户"
            okText="确认"
            v-model:visible="avatarVisible"
            @ok="avatarVisible = false"
            @cancel="$router.push('/system/users')"
          >
            <img :src="userStore.profile?.avatar" class="w-full h-full" alt="头像" />
          </a-modal>
        </div>
        <h2 class="ml-2 mb-0">{{ userStore.profile.nickname }}</h2>
      </div>
    </div>
  </a-layout-header>
</template>

<style scoped lang="scss">
.avatar {
  @apply w-[40px] h-[40px] border-2 border-gray-200 rounded-full overflow-hidden flex justify-center items-center;
  img {
    width: 100%;
    height: 100%;
  }
}

.icon {
  @apply mr-6 cursor-pointer;
  font-size: 18px;
}

.ant-dropdown-link {
  display: flex;
}

.menu-item {
  @apply border-b border-b-gray-600;
}
</style>
