<script setup lang="ts">
import { login } from '@/apis/login';
import { cacheEnum } from '@/enum/cacheEnum';
import utils from '@/utils';
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userStore } from '@/store/user';

const router = useRouter();
const { handleSubmit } = useForm({
  initialValues: {
    username: '',
    password: '',
  },
  validationSchema: {
    username: 'required|min:5|max:8',
    password: 'required|min:6|max:18',
  },
});
const { errorMessage: unameError, value: username } = useField('username', {}, { label: '用户名' });
const { errorMessage: pwdError, value: password } = useField('password', {}, { label: '密码' });

const onSubmit = handleSubmit(async (values) => {
  const { result: token } = (await login(values)) || {};
  if (token) {
    await utils.store.set(cacheEnum.TOKEN, token, 24 * 30);
    ElMessage({
      message: '登录成功!',
      type: 'success',
    });
    return router.push('/');
  }
});
</script>

<template>
  <div>
    <section class="flex flex-col md:flex-row h-screen items-center">
      <div class="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img src="https://source.unsplash.com/random" alt="" class="w-full h-full object-cover" />
      </div>

      <div
        class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div class="w-full h-100">
          <h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">请输入您的账号登录</h1>

          <form class="mt-4" @submit="onSubmit">
            <div>
              <label class="block text-gray-700">用户名</label>
              <input
                type="text"
                placeholder="请输入您的用户名"
                class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autofocus
                required
                v-model="username" />
              <span class="error-message">{{ unameError }}</span>
            </div>

            <div class="mt-4">
              <label class="block text-gray-700">密码</label>
              <input
                v-model="password"
                type="password"
                placeholder="请输入您的密码"
                minlength="6"
                class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required />
              <span class="error-message">{{ pwdError }}</span>
            </div>

            <div class="text-right mt-2">
              <router-link to="/forget-password" class="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >忘记密码？
              </router-link>
            </div>

            <button
              type="submit"
              class="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6">
              登录
            </button>
          </form>

          <p class="mt-8">
            您需要用一个账号？
            <router-link to="/registry" class="text-blue-500 hover:text-blue-700 font-semibold">创建一个账号</router-link>
          </p>
          <router-link to="/" class="text-blue-500 block mt-2 hover:text-blue-700 font-semibold">返回首页</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
