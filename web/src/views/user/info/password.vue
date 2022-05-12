<script setup lang='ts'>
import { FormInstance, FormRules } from 'element-plus';
import { forget_password, forgetPassword, sendEmailCode } from '@/apis/register';
import { ElMessage } from 'element-plus/es';
import router from '@/router';
import utils from '@/utils';
import { cacheEnum } from '@/enum/cacheEnum';
import { userStore } from '@/store/user';

const user = userStore();
const passwordForm = reactive<forgetPassword>({
  email: '',
  password: '',
  password_confirmation: '',
  code: null
});
watch(() => user.profile, (value) => {
  passwordForm.email = value?.email!;
}, { deep: true, immediate: true });

const passwordFormRef = ref<FormInstance>();
const sendEmailText = ref<string | number>('获取验证码');
const sendEmailBtn = ref<HTMLButtonElement>();
const sendEmailBtnDisableState = ref(false);
const intervalId = ref<NodeJS.Timer>();

const checkPasswordConfirmation = (rule: any, value: any, callback: any) => {
  callback(value !== passwordForm.password ? new Error('两次输入的密码不一致') : undefined);
};
const passwordRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { type: 'number', message: '验证码格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度在6~18位之间', trigger: 'blur' }
  ],
  password_confirmation: [{ validator: checkPasswordConfirmation, trigger: 'blur' }]
});

// 切换禁用状态
function changeSendState() {
  clearInterval(intervalId.value!);
  sendEmailBtnDisableState.value = !sendEmailBtnDisableState.value;
  sendEmailText.value = sendEmailBtnDisableState.value ? 60 : '发送验证码';
}

const sendEmail = async () => {
  const { result } = await sendEmailCode(passwordForm.email!) || {};
  if (!result) return;
  changeSendState();
  intervalId.value = setInterval(() => {
    sendEmailText.value <= 0 ? changeSendState() : (sendEmailText.value as number)--;
  }, 1000);
};
const passwordSubmit = () => {
  passwordFormRef.value?.validate(async valid => {
    if (!valid) return;
    const { result } = (await forget_password(passwordForm)) || {};
    if (result) {
      ElMessage({
        type: 'success',
        message: '重置密码成功'
      });
      utils.store.remove(cacheEnum.TOKEN);
      return router.push('/login');
    }
  });
};
</script>

<template>
  <div class='password'>
    <el-form class='mt-4' ref='passwordFormRef' :model='passwordForm' :rules='passwordRules' label-width='100px'
             size='large'>
      <el-form-item label='邮箱' prop='email'>
        <el-input v-model='passwordForm.email' disabled />
      </el-form-item>
      <el-form-item label='验证码' prop='code'>
        <el-row>
          <el-col :span='24' class='flex items-center gap-4'>
            <el-input ref='sendEmailInput' v-model.number='passwordForm.code' />
            <el-button :disabled='sendEmailBtnDisableState' :class='{disabled:sendEmailBtnDisableState}'
                       ref='sendEmailBtn' type='primary' @click='sendEmail'>
              {{ sendEmailText }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label='新密码' prop='password'>
        <el-input show-password v-model='passwordForm.password' type='password' />
      </el-form-item>
      <el-form-item label='重复新密码' prop='password_confirmation'>
        <el-input show-password v-model='passwordForm.password_confirmation' type='password' />
      </el-form-item>
    </el-form>
    <div class='text-right'>
      <el-button type='primary' size='large' @click='passwordSubmit'>提交重置</el-button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.password {
  @apply p-4;
}
</style>
