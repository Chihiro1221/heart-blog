<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { userStore } from '@/store/user';

const user = userStore();
// 退出登录
const logout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      user.logout();
      ElMessage({
        type: 'success',
        message: '已退出！',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消!',
      });
    });
};
</script>

<template>
  <el-card shadow="never" class="box-card w-full">
    <template #header>
      <div class="card-header">
        <span>社区小帖</span>
      </div>
    </template>
    <div class="text-center" v-if="!user.isLogin">
      <h2>欢迎访问我的博客！</h2>
      <p class="text-gray-500 text-sm my-2">您可以选择注册账号发布文章支持本网站</p>
      <p class="text-gray-500 text-sm my-2">这里是一个主张技术分享的社区</p>
      <div class="mt-4">
        <el-button type="primary" @click="$router.push('/registry')">注册</el-button>
        <el-button type="success" @click="$router.push('/login')">登录</el-button>
      </div>
    </div>
    <div v-else>
      <div class="cursor-pointer grid grid-flow-col justify-start items-start relative group">
        <div class="flex items-center" @click="$router.push('/user')">
          <img v-if="user?.profile?.avatar" class="w-[50px]" :src="user.profile.avatar" alt="" />
          <div v-else class="circle-avatar">{{ user.profile?.username?.toUpperCase()[0] }}</div>
          <div class="ml-2">
            <h2 class="font-bold">{{ user?.profile?.nickname ?? user?.profile?.username }}</h2>
            <p v-if="user?.profile?.description" class="text-sm text-gray-500 truncate">
              {{ user?.profile?.description }}
            </p>
            <p class="text-sm" v-else>这个人很懒什么都没留下。</p>
          </div>
        </div>
        <div class="text-xs flex flex-col items-end text-violet-600 absolute right-0 duration-300 opacity-0 group-hover:opacity-100">
          <div @click="logout">
            <span>退出</span>
          </div>
        </div>
      </div>
      <div class="profile">
        <div>
          <h2>文章数</h2>
          <span class="text-sm">{{ user?.profile?.articles?.count ?? 0 }}</span>
        </div>
        <div>
          <h2>获赞数</h2>
          <span class="text-sm">{{ user?.profile?.likes?.count ?? 0 }}</span>
        </div>
        <div>
          <h2>浏览数</h2>
          <span class="text-sm">{{ user?.profile?.browsers?.count ?? 0 }}</span>
        </div>
      </div>
      <div class="edit mt-4">
        <el-button type="primary" @click="$router.push('/post/create')">发表文章</el-button>
        <el-button type="success" @click="$router.push('/user')">个人中心</el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.profile {
  @apply grid grid-flow-col mt-4 justify-center gap-10;
  > div {
    @apply text-center;
  }
}

.circle-avatar {
  @apply w-[50px] text-xl h-[50px] rounded-full bg-violet-700 text-white flex justify-center items-center;
}
</style>
