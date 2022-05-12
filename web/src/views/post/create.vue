<script setup lang="ts">
import utils from '@/utils';
import { Plus } from '@icon-park/vue-next';
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import categoryService from '@/composable/category';
import tagService from '@/composable/tag';
import { createArticle, CreateArticle, fetchArticle, updateArticle } from '@/apis/article';
import router from '@/router';
import { Status } from '@/enum/statusEnum';
import { IArticle } from '#/responseResult';
import { uploadImage } from '@/apis/upload';

const { id } = defineProps({
  id: {
    type: String,
  },
});
const form = ref<CreateArticle | IArticle>({
  title: '',
  cover: '',
  tags: [],
  category: null,
  content: '',
  status: Status.PRIVATE,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 30, message: '文章标题不超过30字', trigger: 'blur' },
  ],
  cover: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
});

const fetch = async () => {
  const { result } = (await fetchArticle(id!)) || {};
  if (!result) ElMessage({ type: 'error', message: '获取文章失败' });
  form.value = result;
};
if (id) {
  fetch();
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (!response.result.url) return ElMessage({ type: 'error', message: '上传失败' });
  form.value.cover = response.result.url;
};
const submit = (status?: Status) => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    if (status) form.value.status = status;
    const { result } = (await createArticle(form.value as CreateArticle)) || {};
    if (!result) return ElMessage({ type: 'error', message: '发布失败' });
    ElMessage({
      type: 'success',
      message: status ? '草稿创建成功' : '文章创建成功，待审核。',
    });
    await router.push('/user/info/topic');
  });
};
const updateSubmit = (status?: Status) => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    form.value.status = Status.PRIVATE;
    if (status) form.value.status = status;
    const { result } = (await updateArticle(id!, form.value as IArticle)) || {};
    if (!result) return ElMessage({ type: 'error', message: '更新失败' });
    ElMessage({
      type: 'success',
      message: '文章更新成功，待审核。',
    });
    await router.push('/user/info/topic');
  });
};
const handleUploadImage = async (event: Event, insertImage: Function, files: any) => {
  const formData = new FormData();
  formData.append('file', files[0]);
  const { result } = await uploadImage(formData);
  insertImage({
    url: result.url,
    desc: result.filename,
  });
};
</script>

<template>
  <div class="main-container !p-0 mb-8 !block bg-white mt-4">
    <div class="header border-b p-4">
      <h2>发表文章</h2>
      <div class="text-red-600 text-sm mt-2">注意：请完善个人信息之后发表文章！</div>
    </div>
    <div class="content p-8">
      <el-form :model="form" ref="formRef" :rules="rules" size="large">
        <el-form-item prop="title">
          <el-input placeholder="请输入文章标题" class="w-full" v-model="form.title"></el-input>
        </el-form-item>
        <p class="text-gray-500 text-sm mb-1">在这里上传封面</p>
        <el-form-item prop="cover">
          <el-upload
            class="avatar-uploader cover-uploader"
            :action="utils.uploadUrl()"
            :headers="utils.setAuthorization()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="form.cover" :src="form.cover" class="max-w-[300px]" alt="" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-select v-model="(form.category as string)" placeholder="请选择所属分类" clearable>
            <el-option
              v-for="category in categoryService.categories.value"
              :key="category._id"
              :label="category.name"
              :value="category._id" />
          </el-select>
        </el-form-item>
        <p class="text-gray-500 text-sm mb-1">最多可选择5个标签</p>
        <el-form-item>
          <el-select v-model="form.tags" multiple :multiple-limit="5" placeholder="请选择标签" style="width: 240px">
            <el-option v-for="tag in tagService.naturalTags.value" :key="tag._id" :label="tag.name" :value="tag._id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="content">
          <v-md-editor v-model="form.content" :disabled-menus="[]" @upload-image="handleUploadImage" height="400px"></v-md-editor>
        </el-form-item>
        <div class="flex items-center justify-end">
          <el-button v-if="!id" type="success" @click="submit(Status.DRAFT)">保存文稿</el-button>
          <el-button v-if="!id" type="primary" @click="submit()">发布文章</el-button>
          <el-button v-else-if="form.status === Status.DRAFT" type="primary" @click="updateSubmit(Status.PRIVATE)">发布文章</el-button>
          <el-button v-else type="primary" @click="updateSubmit()">更新文章</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button-container {
  @apply flex items-center;
  justify-content: end !important;
}
</style>
