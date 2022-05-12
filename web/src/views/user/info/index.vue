<script setup lang="ts">
import { getProfile } from '@/apis/login';
import BasicForm from '@/layouts/user/info/basicForm.vue';
import { UserBasic } from '@/apis/user';
import { BlogRoll } from '@/apis/blogroll';
import { IUser } from '#/responseResult';
import BlogrollForm from '@/layouts/user/info/blogrollForm.vue';
import { ElMessage } from 'element-plus';
import { userStore } from '@/store/user';

const user = userStore();
const activeName = ref('basic');
const form = ref<IUser>();

const basicForm = ref<UserBasic>({
  nickname: '',
  qq: 0,
  email: '',
  description: '',
  blogroll: null,
  avatar: '',
});
const blogrollForm = ref<BlogRoll>({
  avatar: '',
  description: '',
  site: '',
  user: user.profile?._id,
});
const fetchUserInfo = async () => {
  const { result } = (await getProfile()) || {};
  if (!result) ElMessage({ type: 'error', message: '获取用户信息失败' });
  form.value = result;
  // 只保留基本信息
  for (const key in basicForm.value) {
    if (basicForm.value.hasOwnProperty(key)) {
      basicForm.value[key] = result[key];
    }
  }

  // 只保留友链信息
  for (const key in blogrollForm.value) {
    if (blogrollForm.value.hasOwnProperty(key) && result?.blogroll) {
      blogrollForm.value[key] = result?.blogroll![key];
    }
  }
};
fetchUserInfo();
const resetUserProfile = () => {
  user.getUserProfile();
  fetchUserInfo();
};
</script>

<template>
  <div v-if="form" class="basic">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="basic">
        <BasicForm :form="basicForm" :user="form" @submit="resetUserProfile" />
      </el-tab-pane>
      <el-tab-pane label="友情链接" name="blogroll">
        <BlogrollForm :form="blogrollForm" :user="form" @submit="resetUserProfile" :nativeForm="form" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.basic {
  @apply p-4;
}
</style>
