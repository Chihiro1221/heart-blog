<script setup lang="ts">
import { FileItem } from "#/upload"
import rules from "@/rules"
import { articleFormState } from "@/rules/articleRules"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue"
import { setAuthorization, uploadUrl } from "@/utils/uploadUrl"
import { message } from "ant-design-vue"
import { ref } from "vue"
import articleApi from "@/apis/articleApi"
import listService from "@/composables/list"
import { Status } from "@/enum/apiEnum"
import { authStore } from "@/store/auth"
import router from "@/router"
import { AlbumDocument } from "@/apis/albumApi"
interface IProp {
  id?: string
}
const props = defineProps<IProp>()
const formRef = ref()
const loading = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const selectedByAlbum = ref<boolean>(false)
const photo = ref<AlbumDocument>()
const fetch = async () => {
  const res = await articleApi.getById(props.id!)
  articleFormState.value = res.result
}

if (props.id) {
  articleFormState.value.content = null
  fetch()
} else {
  articleFormState.value = { title: "", content: "", status: Status.DRAFT, is_stick: 0, cover: "" }
}

const activeKey = ref("1")
const onFinish = async () => {
  submitLoading.value = true
  formRef.value
    .validate()
    .then(async () => {
      let res
      if (props.id) res = (await articleApi.updateById(props.id, articleFormState.value)).result
      else {
        articleFormState.value.author = authStore().profile._id
        res = (await articleApi.add(articleFormState.value)).result
      }
      if (res) message.success("编辑成功!")
      await listService.initArticles()
      await router.push("/content/articles")
    })
    .catch((error: Error) => {
      message.error("请填写必要字段!")
    })
  submitLoading.value = false
}

const beforeUpload = (file: FileItem) => {}

// 上传图片生命周期
const handleChange = (info: any) => {
  if (info.file.status === "uploading") {
    loading.value = true
    return
  }
  if (info.file.status === "done") {
    articleFormState.value.cover = info.file.response?.result.url
    loading.value = false
  }
  if (info.file.status === "error") {
    loading.value = false
    message.error("上传失败!")
  }
  return
}
// 从相册中选择
const selectAlbumHandler = () => {
  articleFormState.value.cover = photo.value?.picture!
  selectedByAlbum.value = false
}
// 取消选择
const cancelSelectedAlbum = () => {}
</script>

<template>
  <a-form ref="formRef" :label-col="{ span: 2 }" :model="articleFormState" :rules="rules.article" name="basic" autocomplete="off">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="文章内容">
        <a-form-item :wrapper-col="{ span: 16 }" label="文章标题" name="title" placeholder="请输入文章标题">
          <a-input v-model:value="articleFormState.title"></a-input>
        </a-form-item>
        <a-form-item label="文章封面" name="cover" placeholder="请上传文章封面">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="uploadUrl()"
            :headers="setAuthorization()"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="articleFormState.cover" :src="articleFormState.cover" alt="cover" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-button type="primary" @click="selectedByAlbum = true">从相册中选择</a-button>
          <div class="mt-2 text-gray-600">注意：若是不上传封面则会自动从相册中随机选取。</div>
          <a-modal
            v-model:visible="selectedByAlbum"
            width="800px"
            okText="确认"
            cancelText="取消"
            title="选择封面"
            @ok="selectAlbumHandler"
            @cancel="cancelSelectedAlbum"
          >
            <template class="flex justify-start">
              <div
                :class="{ active: photo?._id === img._id }"
                @click="photo = img"
                class="photo"
                v-for="img of listService.album.value"
                :key="img._id!"
              >
                <img :src="img.picture" alt="" />
              </div>
            </template>
          </a-modal>
        </a-form-item>

        <a-form-item label="文章内容" name="content" placeholder="来编写你的文章内容把~">
          <Markdown v-if="articleFormState.content !== null" v-model="articleFormState.content" />
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane key="2" tab="其他设置" force-render>
        <a-form-item :wrapper-col="{ span: 8 }" label="分类" name="category" placeholder="请选择所属分类">
          <a-tree-select
            v-model:value="articleFormState.category"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="listService.categories.value"
            :replaceFields="{
              children: 'children',
              label: 'name',
              key: '_id',
              value: '_id',
            }"
            allow-clear
            placeholder="所属分类"
            show-search
            style="width: 100%"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 8 }" label="标签">
          <a-select
            v-model:value="(articleFormState.tags as string[])"
            mode="multiple"
            :maxTagCount="5"
            style="width: 100%"
            placeholder="请选择文章标签"
          >
            <a-select-option :value="item._id" v-for="item of listService.tags.value" :key="item._id">{{ item.name }} </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 8 }" label="是否置顶">
          <a-switch v-model:checked="articleFormState.is_stick" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 8 }" label="状态">
          <a-radio-group v-model:value="articleFormState.status" button-style="solid">
            <a-radio-button v-for="status of Status" :key="status" :value="status">
              <span v-if="status === Status.ISSUE">
                <a-badge color="green" text="已发布" />
              </span>
              <span v-else-if="status === Status.DRAFT">
                <a-badge text="草稿" status="default" />
              </span>
              <span v-else-if="status === Status.PRIVATE">
                <a-badge color="orange" text="私密" />
              </span>
              <span v-else>
                <a-badge color="red" text="回收站" />
              </span>
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-tab-pane>
    </a-tabs>
    <a-button htmlType="submit" @click="onFinish" class="float-right mb-4" type="primary" :loading="submitLoading">提交 </a-button>
  </a-form>
</template>

<style scoped lang="scss"></style>
