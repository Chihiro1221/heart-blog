<script setup lang="ts">
import { ElMessage, FormInstance, UploadProps } from 'element-plus';
import { BlogRoll, createBlogroll, updateBlogroll } from '@/apis/blogroll';
import { IUser, UserForm } from '#/responseResult';
import { Plus } from '@element-plus/icons-vue';
import utils from '@/utils';

interface IProp {
  form: BlogRoll;
  user: IUser;
  nativeForm: UserForm;
}

const { user, nativeForm, form } = withDefaults(defineProps<IProp>(), {});
const emit = defineEmits(['submit']);
const blogrollFormRef = ref<FormInstance>();
const blogrollForm = ref<BlogRoll>(form);
const blogrollRules = reactive({
  avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
  site: [
    {
      required: true,
      message: '请填写网站地址',
      trigger: 'blur',
    },
    {
      pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      message: '请填写正确的网址',
      trigger: 'blur',
    },
  ],
  description: [
    { required: true, message: '请填写网站描述', trigger: 'blur' },
    { max: 50, message: '最多50个字符', trigger: 'blur' },
  ],
});

const blogrollSubmit = () => {
  blogrollFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    blogrollForm.value.status = 0;
    const { result } = user.blogroll
      ? await updateBlogroll(user.blogroll._id, blogrollForm.value)
      : await createBlogroll(blogrollForm.value);
    if (result) ElMessage({ type: 'success', message: user.blogroll ? '更新成功' : '申请成功' });
    emit('submit');
  });
};
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (!response.result.url) return ElMessage({ type: 'error', message: '上传失败' });
  blogrollForm.value.avatar = response.result.url;
};
const useBasicAvatar = () => {
  if (!nativeForm.avatar) ElMessage({ type: 'warning', message: '请先上传个人头像' });
  blogrollForm.value.avatar = nativeForm.avatar!;
};
</script>

<template>
  <el-form :model="blogrollForm" :rules="blogrollRules" ref="blogrollFormRef" label-width="80px" size="large">
    <el-form-item label="友链头像" prop="avatar">
      <el-upload
        class="avatar-uploader"
        :action="utils.uploadUrl()"
        :headers="utils.setAuthorization()"
        :show-file-list="false"
        :on-success="handleAvatarSuccess">
        <img v-if="blogrollForm.avatar" :src="blogrollForm.avatar" class="avatar !w-[80px] !h-[80px]" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <div class="text-xl mx-4">or</div>
      <el-button type="primary" size="default" @click="useBasicAvatar">使用个人信息头像</el-button>
    </el-form-item>
    <el-form-item label="网站地址" prop="site">
      <el-input v-model="blogrollForm.site"></el-input>
      <div class="text-gray-500">网站地址格式：http://baidu.(com|cn|..)</div>
    </el-form-item>
    <el-form-item label="简介" prop="description">
      <el-input v-model="blogrollForm.description" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <div class="text-right">
      <el-button type="primary" @click="blogrollSubmit">
        {{ user.blogroll ? '更新提交' : '提交申请' }}
      </el-button>
      <div v-if="!user?.blogroll?.status && user.blogroll" class="mt-2 text-gray-600 text-[14px]">申请中，请耐心等待</div>
      <div v-else-if="user?.blogroll?.status" class="mt-2 text-[#2ecc71] text-[14px]">已通过</div>
      <div v-else>尚未申请</div>
    </div>
  </el-form>
</template>

<style scoped lang="scss"></style>
