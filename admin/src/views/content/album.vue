<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import rules from "@/rules"
import listService from "@/composables/list"
import albumApi from "@/apis/albumApi"
import { albumFormState, albumColumns } from "@/rules/albumRules"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
import { uploadUrl, setAuthorization } from "@/utils/uploadUrl"
import { FileItem } from "#/upload"

const loading = ref<boolean>(false)
const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
// 多选数组
const selectRowKeys = ref<string[]>()
// 编辑
const edit = async (id: string) => {
  const res = (await albumApi.getById(id)).result
  visible.value = true
  albumFormState.value = { ...albumFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
  albumFormState.value = {
    picture: "",
  }
}
// 删除
const remove = async (id: string) => {
  const res = (await albumApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    await listService.initAlbum()
  }
}

// 验证成功
const onFinish = async () => {
  formRef.value.validate()
  confirmLoading.value = true
  let res
  if (albumFormState.value._id) {
    res = (await albumApi.updateById(albumFormState.value._id, { ...albumFormState.value })).result
  } else {
    res = (await albumApi.add(albumFormState.value)).result
  }
  if (res) {
    confirmLoading.value = false
    visible.value = false
    message.success("编辑成功")
    await listService.initAlbum()
  }
}
// 取消操作
const cancel = () => {
  formRef.value.resetFields()
}

const rowSelection = {
  // 选中事件
  onChange: (selectedRowKeys: string[]) => {
    selectRowKeys.value = selectedRowKeys
  },
}

const cancelDelete = () => {
  message.info("取消删除")
}
// 删除所选
const deleteMany = async () => {
  const res = (await albumApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功")
    await listService.initAlbum()
  }
}
// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})
// 上传图片之前
const beforeUpload = (file: FileItem) => {}

// 上传图片生命周期
const handleChange = (info: any) => {
  if (info.file.status === "uploading") {
    loading.value = true
    return
  }
  if (info.file.status === "done") {
    albumFormState.value.picture = info.file.response?.result.url
    loading.value = false
  }
  if (info.file.status === "error") {
    loading.value = false
    message.error("上传失败!")
  }
  return
}
</script>
<template>
  <div class="menu-container">
    <a-table
      :columns="albumColumns"
      :data-source="listService.album.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">相册管理</h1>
          <a-button type="primary" @click="add">新增</a-button>
          <a-button :disabled="deleteManyState" class="ml-2 mt-2" danger type="primary" @click="deleteMany">删除所选 </a-button>
        </div>
      </template>

      <template #picture="{ text: picture, record: row }">
        <img class="cursor-pointer max-w-[150px]" style="margin: 0 auto" :src="picture" alt="..." @click="row.picture_isShow = true" />
        <a-modal width="650px" v-model:visible="row.picture_isShow" :footer="null" title="预览图" @ok="row.picture_isShow = false">
          <img :src="picture" alt="..." />
        </a-modal>
      </template>

      <template #tags="{ text: tags }">
        <template v-if="tags?.length">
          <a-tag
            class="!m-1"
            v-for="tag of tags"
            :key="tag._id"
            :style="{ borderColor: tag?.color, backgroundColor: 'white', color: tag?.color }"
            >{{ tag?.name }}
          </a-tag>
        </template>
        <span v-else>--</span>
      </template>

      <template #description="{ text: description }">
        <span v-if="description">{{ description }}</span>
        <span v-else>---</span>
      </template>

      <template #action="{ text: row }">
        <a-button size="small" type="link" @click="edit(row._id)">编辑</a-button>
        <a-popconfirm cancel-text="取消" ok-text="确认" title="确认删除这个标签吗" @cancel="cancelDelete" @confirm="remove(row._id)">
          <a-button class="ml-2" danger size="small" type="text">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      :width="650"
      cancelText="取消"
      okText="确认"
      title="添加菜单"
      @cancel="cancel"
      @ok="onFinish"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 2 }"
        :model="albumFormState"
        :rules="rules.tag"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
        @finish="onFinish"
      >
        <a-form-item label="图片" name="picture">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :headers="setAuthorization()"
            :action="uploadUrl()"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="albumFormState.picture" :src="albumFormState.picture" alt="picture" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="简介">
          <a-textarea
            v-model:value="albumFormState.description"
            placeholder="在这里输入图片简介"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            auto-size
          />
        </a-form-item>

        <a-form-item label="标签">
          <a-select
            v-model:value="(albumFormState.tags as string[])"
            mode="multiple"
            :maxTagCount="5"
            style="width: 100%"
            placeholder="请选择标签"
          >
            <a-select-option :value="item._id" v-for="item of listService.tags.value" :key="item._id">{{ item.name }} </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
