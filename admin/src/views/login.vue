<script lang='ts' setup>
import { login } from '@/apis/authApi';
import { useField, useForm } from 'vee-validate';
import { message } from 'ant-design-vue';
import { utils } from '@/utils';
import { cacheEnum } from '@/enum/cacheEnum';
import { useRouter } from 'vue-router';
import { authStore } from '@/store/auth';
import autoload from '@/router/autoload';
import menuService from '@/composables/menu';
import listService from '@/composables/list';

const router = useRouter();
const { handleSubmit } = useForm({
  initialValues: {
    username: '',
    password: ''
  },
  validationSchema: {
    username: 'required|min:5|max:8',
    password: 'required|min:6|max:18'
  }
});
const { errorMessage: unameError, value: username } = useField('username', {}, { label: '用户名' });
const { errorMessage: pwdError, value: password } = useField('password', {}, { label: '密码' });

const onSubmit = handleSubmit(async (values) => {
  const res = await login(values);
  if (res.result.token) {
    message.success('登录成功');
    // 传递过期时间(小时单位)
    utils.store.set(cacheEnum.TOKEN, res.result, 24 * 30);
    await router.push('/');
    await authStore().getProfile(res.result.token);
    autoload(router);
    await listService.init();
    await menuService.initMenus();
  }
});
</script>

<template>
  <div class='login'>
    <div class='min-h-screen flex justify-center md:justify-between'>
      <div class='hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center'>
        <div>
          <h1 class='text-white font-bold text-4xl font-sans'>后台管理</h1>
          <p class='text-white mt-1'>欢迎前往我的博客预览，Welcome my blog fo view</p>
          <a
            class='cursor-pointer text-center block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2'
            href='https://www.chihiross.com'
            type='submit'
          >前往博客</a
          >
        </div>
      </div>
      <div class='flex md:w-1/2 justify-center bg-white'>
        <form class='bg-white flex-1 md:p-20 translate-y-20' @submit='onSubmit'>
          <h1 class='text-gray-800 font-bold text-2xl mb-1'>欢迎!</h1>
          <p class='text-sm font-normal text-gray-600 mb-7'>Welcome Back</p>
          <div
            class='flex items-center border-2 px-3 ehr rounded-xl mb-4 focus-within:ring-2 duration-300 ring-offset-2 ring-offset-blue-500'
          >
            <svg class='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                 xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
            </svg>
            <input v-model='username' class='flex-1 py-2 pl-2 outline-none border-none' placeholder='请输入用户名'
                   type='text' />
            <span class='error-message'>{{ unameError }}</span>
          </div>
          <div
            class='flex items-center border-2 px-3 ehr rounded-xl mb-4 focus-within:ring-2 duration-300 ring-offset-2 ring-offset-blue-500'
          >
            <svg class='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                 xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
            </svg>
            <input v-model='password' class='flex-1 py-2 pl-2 outline-none border-none' placeholder='请输入密码'
                   type='password' />
            <span class='error-message'>{{ pwdError }}</span>
          </div>
          <button
            class='block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2 hover:bg-indigo-800 duration-300'
            type='submit'
          >
            登录
          </button>
          <span class='text-sm ml-2 hover:text-blue-500 cursor-pointer'>Forgot Password ?</span>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.login {
  overflow: hidden;
}

.error-message {
  @apply text-red-500 text-sm;
}
</style>
