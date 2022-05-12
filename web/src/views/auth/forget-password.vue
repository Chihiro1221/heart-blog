<script setup lang='ts'>
import { useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { forgetPassword, forget_password, sendEmailCode } from '@/apis/register';
import { ElMessage } from 'element-plus';

const router = useRouter();
const { handleSubmit } = useForm({
  initialValues: {
    password: '',
    password_confirmation: '',
    email: '',
    code: null,
  } as forgetPassword,
  validationSchema: {
    password: 'required|min:6|max:18',
    password_confirmation: 'confirmed:@password',
    email: 'required|email',
    code: 'required|number|digits:4',
  },
});
const { errorMessage: pwdError, value: password } = useField<string>('password', {}, { label: '密码' });
const {
  errorMessage: pwd_confirmError,
  value: password_confirmation,
} = useField<string>('password_confirmation', {}, { label: '确认密码' });
const { errorMessage: emailError, value: email } = useField<string>('email', {}, { label: '邮箱' });
const { errorMessage: codeError, value: code } = useField<number>('code', {}, { label: '验证码' });
const sendEmailText = ref<string | number>('获取验证码');
const sendEmailBtn = ref<HTMLButtonElement>();
const sendEmailInput = ref<HTMLInputElement>();
const intervalId = ref<NodeJS.Timer>();
// 提交重置按钮
const onSubmit = handleSubmit(async (values: forgetPassword) => {
  const { result } = (await forget_password(values)) || {};
  if (result) {
    ElMessage({
      type: 'success',
      message: '重置密码成功',
    });
    return router.push('/login');
  }
});

// 切换禁用状态
function changeSendState(el: HTMLButtonElement) {
  clearInterval(intervalId.value!);
  el.disabled = !el.disabled;
  sendEmailInput.value!.disabled = !sendEmailInput.value!.disabled;
  el.classList.toggle('disabled');
  sendEmailText.value = el.disabled ? 60 : '发送验证码';
}

// 发送验证码
const sendEmail = async () => {
  if (!emailError.value && email.value) {
    await sendEmailCode(email.value);
    changeSendState(sendEmailBtn.value!);
    intervalId.value = setInterval(() => {
      sendEmailText.value <= 0 ? changeSendState(sendEmailBtn.value!) : (sendEmailText.value as number)--;
    }, 1000);
  }
};
</script>

<template>
  <div>
    <section class='flex flex-col md:flex-row h-screen items-center'>
      <div class='bg-indigo-600 hidden lg:block w-1/2 h-screen'>
        <img src='https://source.unsplash.com/random' alt='' class='w-full h-full object-cover' />
      </div>

      <div
        class='bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center'
      >
        <div class='w-full h-100'>
          <h1 class='text-xl md:text-2xl font-bold leading-tight mt-12 text-center'>重置密码</h1>

          <form class='mt-4' @submit.prevent='onSubmit'>
            <!-- 邮箱 -->
            <div class='mt-4'>
              <label class='block text-gray-700'>邮箱</label>
              <div class='flex items-center gap-2'>
                <input
                  v-model='email'
                  ref='sendEmailInput'
                  type='email'
                  placeholder='请输入邮箱'
                  minlensgth='6'
                  class='w-full px-4 py-3 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none'
                  required
                />
              </div>
              <span class='error-message'>{{ emailError }}</span>
            </div>

            <!-- 验证码 -->
            <div class='mt-4'>
              <label class='block text-gray-700'>验证码</label>
              <div class='flex items-center gap-2'>
                <input
                  v-model.number='code'
                  type='number'
                  placeholder='请输入验证码'
                  minlength='6'
                  class='w-full px-4 py-3 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none'
                  required
                />
                <button
                  ref='sendEmailBtn'
                  type='button'
                  class='block duration-300 min-w-[120px] bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3'
                  @click='sendEmail'
                >
                  {{ sendEmailText }}
                </button>
              </div>
              <span class='error-message'>{{ codeError }}</span>
            </div>
            <!-- 密码 -->
            <div class='mt-4'>
              <label class='block text-gray-700'>密码</label>
              <input
                v-model='password'
                type='password'
                placeholder='请输入您的密码'
                minlength='6'
                class='w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                required
              />
              <span class='error-message'>{{ pwdError }}</span>
            </div>
            <!-- 密码 -->
            <div class='mt-4'>
              <label class='block text-gray-700'>重复密码</label>
              <input
                v-model='password_confirmation'
                type='password'
                placeholder='请输入重复密码'
                minlength='6'
                class='w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'
                required
              />
              <span class='error-message' v-if='pwd_confirmError'>两次密码不一致</span>
            </div>

            <button
              type='submit'
              class='w-full duration-300 block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6'
            >
              重置密码
            </button>
          </form>
          <div class='mt-2 gap-4 flex items-center'>
            <router-link to='/login' class='text-blue-500 text-right hover:text-blue-700 font-semibold'>前往登录
            </router-link>
            <router-link to='/' class='text-blue-500 text-right hover:text-blue-700 font-semibold'>返回首页</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
