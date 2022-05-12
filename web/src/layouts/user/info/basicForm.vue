<script setup lang="ts">
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { updateUserBasic, UserBasic } from '@/apis/user';
import Badge from '@/components/badge.vue';
import { IUser } from '#/responseResult';
import { Plus } from '@element-plus/icons-vue';
import utils from '@/utils';

interface IProp {
  form: UserBasic;
  user: IUser;
}

const prop = withDefaults(defineProps<IProp>(), {});
const emit = defineEmits(['submit']);
const basicForm = ref<UserBasic>(prop.form);
const basicFormRef = ref<FormInstance>();
const basicRules = reactive<FormRules>({
  nickname: [{ min: 2, max: 10, message: '用户昵称在2~10个字符之间', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  qq: [{ type: 'number', message: 'QQ号码必须是数字', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  description: {
    max: 200,
    message: '个人简介不能超过200个字符',
    trigger: 'blur',
  },
});
const basicSubmit = () => {
  basicFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const { result } = (await updateUserBasic(prop.user._id, basicForm.value)) || {};
    if (result) {
      emit('submit');
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    }
  });
};
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (!response.result.url) return ElMessage({ type: 'error', message: '上传失败' });
  basicForm.value.avatar = response.result.url;
};
</script>

<template>
  <el-row>
    <el-col>
      <el-form ref="basicFormRef" :rules="basicRules" class="mt-4" :model="basicForm" label-width="80px" size="large">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="basicForm.nickname" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="utils.uploadUrl()"
            :headers="utils.setAuthorization()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="basicForm.avatar" :src="basicForm.avatar" class="avatar !w-[80px] !h-[80px]" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model.number="basicForm.qq" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="basicForm.email" />
        </el-form-item>
        <el-form-item label="个人简介" prop="description">
          <el-input v-model="basicForm.description" :rows="4" type="textarea" />
        </el-form-item>
        <el-form-item label="友情链接">
          <badge v-if="!basicForm.blogroll" color="#e74c3c">未加入</badge>
          <badge v-else-if="!basicForm.blogroll.status" color="#e67e22">申请中</badge>
          <badge v-else color="#2ecc71">已加入</badge>
        </el-form-item>
        <div class="text-right">
          <el-button type="primary" @click="basicSubmit">保存修改</el-button>
        </div>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
