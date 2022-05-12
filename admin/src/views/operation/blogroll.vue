<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue"
import listService from "@/composables/list"
import { FileItem } from "#/upload"
import blogrollApi from "@/apis/blogrollApi"
import { blogrollFormState, blogrollColumns } from "@/rules/blogrollRules"
import { setAuthorization, uploadUrl } from "@/utils/uploadUrl"
import rules from "@/rules"

const formRef = ref()
const visible = ref<boolean>(false)
const activeKey = ref("1")

// 多选数组
const selectRowKeys = ref<string[]>()

// 编辑
const edit = async (id: string) => {
  const res = (await blogrollApi.getById(id)).result
  visible.value = true
  blogrollFormState.value = { ...blogrollFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
}
// 删除
const remove = async (id: string) => {
  const res = (await blogrollApi.deleteById(id)).result
  if (res) {
    message.success("删除成功!")
    await listService.initBlogroll()
    // await fetch()
  }
}

// 提交表单
const onFinish = async () => {
  formRef.value.validate().then(async (_: any) => {
    let res
    if (blogrollFormState.value._id) {
      res = (await blogrollApi.updateById(blogrollFormState.value._id, { ...blogrollFormState.value })).result
    } else {
      res = (await blogrollApi.add(blogrollFormState.value)).result
    }
    if (res) {
      visible.value = false
      message.success("编辑成功")
      await listService.initBlogroll()
    }
  })
}
// 取消操作
const cancel = () => {
  formRef.value.resetFields()
}
// 批量选择
const rowSelection = {
  // 选中事件
  onChange: (selectedRowKeys: string[]) => {
    selectRowKeys.value = selectedRowKeys
  },
}
// 取消删除
const cancelDelete = () => {
  message.info("取消删除!")
}
// 删除所选
const confirmDelete = async () => {
  const res = (await blogrollApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功!")
    await listService.initBlogroll()
  }
}

// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})

// 用户编辑状态
const editState = computed(() => {
  return !!blogrollFormState.value._id
})
// 对话框关闭回调
const modalClosed = () => {
  blogrollFormState.value = {
    avatar: "",
    description: "",
    site: "",
  }
  activeKey.value = "1"
}
// 上传图片loading
const loading = ref<boolean>(false)
// 上传图片之前
const beforeUpload = (file: FileItem) => {}

// 上传图片生命周期
const handleChange = (info: any) => {
  if (info.file.status === "uploading") {
    loading.value = true
    return
  }
  if (info.file.status === "done") {
    blogrollFormState.value.avatar = info.file.response?.result.url
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
      :columns="blogrollColumns"
      :data-source="listService.blogroll?.value"
      :indentSize="50"
      :label-width="100"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">友情链接</h1>
          <a-button class="mr-2" type="primary" @click="add">新增</a-button>
          <a-popconfirm
            cancel-text="取消"
            ok-text="确认"
            title="确认删除这个友链吗？这可能会对你的数据造成影响"
            @cancel="cancelDelete"
            @confirm="confirmDelete"
          >
            <a-button :disabled="deleteManyState" class="mt-2" danger type="primary">删除所选</a-button>
          </a-popconfirm>
        </div>
      </template>
      <template #user="{ text: user, record: row }">
        <a-button type="link" @click="edit(row._id)">
          {{ user.nickname }}
        </a-button>
      </template>
      <template #site="{ text: site, record: row }">
        <a :href="site" target="blank">{{ site }}</a>
      </template>
      <template #status="{ text: status }">
        <a-badge :status="status ? 'success' : 'error'" :text="status ? '已启用' : '未启用'" />
      </template>
      <template #description="{ text: description, record: row }">
        <p>{{ description ? description : "---" }}</p>
      </template>
      <template #avatar="{ text: avatar, record: row }">
        <img :src="avatar" class="avatar lg" alt="avatar" />
      </template>
      <template #action="{ text: row }">
        <a-button size="small" type="link" @click="edit(row._id)">编辑</a-button>
        <a-popconfirm cancel-text="取消" ok-text="确认" title="确认删除这个用户吗" @cancel="cancelDelete" @confirm="remove(row._id)">
          <a-button class="ml-2" danger size="small" type="text">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      :afterClose="modalClosed"
      :width="650"
      cancelText="取消"
      okText="确认"
      title="添加友链"
      @cancel="cancel"
      @ok="onFinish"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 4 }"
        :model="blogrollFormState"
        :rules="rules.blogroll"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
      >
        <a-form-item label="用户" name="user">
          <a-select placeholder="请选择用户" ref="select" v-model:value="(blogrollFormState.user as string)">
            <a-select-option :value="user._id" v-for="user of listService.users.value" :key="user._id">{{ user.nickname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="网站地址" name="site">
          <a-input placeholder="请输入网站地址" v-model:value="blogrollFormState.site" />
        </a-form-item>
        <a-form-item label="是否启用" name="status">
          <a-switch v-model:checked="blogrollFormState.status" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>
        <a-form-item label="简介" name="description">
          <a-textarea placeholder="请输入简介" v-model:value="blogrollFormState.description" />
        </a-form-item>
        <a-form-item label="友链头像" name="avatar">
          <a-upload
            :action="uploadUrl()"
            :before-upload="beforeUpload"
            :headers="setAuthorization()"
            :show-upload-list="false"
            class="avatar-uploader"
            list-type="picture-card"
            name="file"
            @change="handleChange"
          >
            <img v-if="blogrollFormState.avatar" :src="blogrollFormState.avatar" alt="avatar" class="upload-image" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
