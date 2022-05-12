<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import { userColumns } from "@/rules/userRules"
import userApi from "@/apis/userApi"
import { userFormState } from "@/rules/userRules"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue"
import rules from "@/rules"
import listService from "@/composables/list"
import { FileItem } from "#/upload"
import { authStore } from "@/store/auth"
import { setAuthorization, uploadUrl } from "@/utils/uploadUrl"

const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const activeKey = ref("1")

// 多选数组
const selectRowKeys = ref<string[]>()

// 编辑
const edit = async (id: string) => {
  const res = (await userApi.getById(id)).result
  visible.value = true
  userFormState.value = { ...userFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
}
// 删除
const remove = async (id: string) => {
  const res = (await userApi.deleteById(id)).result
  if (res) {
    message.success("删除成功!")
    await listService.initUsers()
    // await fetch()
  }
}

// 修正验证规则
const validatePassChecked = (err: any) => {
  return !err.values.password && !err.values.rawPassword && !err.values.reNewPassword
}

// 提交表单
const onFinish = async () => {
  const finishHandler = async () => {
    confirmLoading.value = true
    let res
    if (userFormState.value._id) {
      res = (await userApi.updateById(userFormState.value._id, { ...userFormState.value })).result
    } else {
      res = (await userApi.add(userFormState.value)).result
    }
    if (res) {
      message.success("编辑成功!")
      await listService.initUsers()
    }
    visible.value = false
  }
  // 表单验证
  formRef.value
    .validate()
    .then(async () => finishHandler())
    .catch((err: any) => {
      const state = validatePassChecked(err)
      if (state && editState.value) {
        formRef.value.clearValidate(["rawPassword", "password", "reNewPassword"])
        finishHandler()
        return
      }
      message.error("请填写必要参数!")
    })
  confirmLoading.value = false
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
  const res = (await userApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功!")
    await listService.initUsers()
  }
}

// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})

// 用户编辑状态
const editState = computed(() => {
  return !!userFormState.value._id
})
// 对话框关闭回调
const modalClosed = () => {
  userFormState.value = {
    username: "",
    nickname: "",
  }
  activeKey.value = "1"
  confirmLoading.value = false
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
    userFormState.value.avatar = info.file.response?.result.url
    loading.value = false
  }
  if (info.file.status === "error") {
    loading.value = false
    message.error("上传失败!")
  }
  return
}
// 用户个人信息
const userStore = authStore()
</script>
<template>
  <div v-if="listService.users?.value.length" class="menu-container">
    <a-table
      :columns="userColumns"
      :data-source="listService.users?.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      :label-width="100"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">用户管理</h1>
          <p><span class="text-green-600 text-xl">*</span> 表示当前账户</p>
          <a-button type="primary" @click="add">新增</a-button>
          <a-popconfirm
            title="确认删除所选用户吗？这可能会对你的数据造成影响"
            ok-text="确认"
            cancel-text="取消"
            @confirm="confirmDelete"
            @cancel="cancelDelete"
          >
            <a-button :disabled="deleteManyState" class="mt-2" danger type="primary">删除所选</a-button>
          </a-popconfirm>
        </div>
      </template>
      <template #username="{ text: username, record: row }">
        <a-button type="link" @click="edit(row._id)">
          {{ username }}
          <span class="text-green-600 text-xl">{{ userStore.profile._id === row._id ? "*" : "" }}</span>
        </a-button>
      </template>
      <template #role="{ text: role }">
        <router-link to="/system/roles" v-if="role">{{ role.nickname }}</router-link>
        <span v-else>----</span>
      </template>
      <template #is_enabled="{ text: is_enabled }">
        <a-tag :color="is_enabled ? 'blue' : 'error'">{{ is_enabled ? "启用" : "暂停" }}</a-tag>
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
      :confirm-loading="confirmLoading"
      :afterClose="modalClosed"
      :width="650"
      cancelText="取消"
      okText="确认"
      @ok="onFinish"
      @cancel="cancel"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 4 }"
        :model="userFormState"
        :rules="rules.user"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
      >
        <a-tabs v-model:activeKey="activeKey" size="small" forceRender>
          <!-- 基本信息 -->
          <a-tab-pane key="1" tab="编辑用户">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="userFormState.username" />
            </a-form-item>

            <a-form-item label="用户昵称" name="nickname">
              <a-input v-model:value="userFormState.nickname" />
            </a-form-item>

            <a-form-item label="角色" name="role">
              <a-select v-model:value="userFormState.role" placeholder="请选择角色">
                <a-select-option :value="role._id" v-for="role of listService.roles.value" :key="role._id"
                  >{{ role.nickname }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="是否启用" name="is_enabled">
              <a-switch v-model:checked="userFormState.is_enabled" :checkedValue="1" :unCheckedValue="0" />
            </a-form-item>
          </a-tab-pane>
          <!-- 密码 -->
          <a-tab-pane key="2" forceRender tab="编辑密码">
            <!-- 编辑用户 -->
            <template v-if="editState">
              <a-form-item label="旧密码" has-feedback name="rawPassword">
                <a-input type="password" v-model:value="userFormState.rawPassword" />
              </a-form-item>

              <a-form-item label="新密码" has-feedback name="password">
                <a-input type="password" v-model:value="userFormState.password" autocomplete="off" />
              </a-form-item>

              <a-form-item label="重复新密码" has-feedback name="reNewPassword">
                <a-input type="password" v-model:value="userFormState.reNewPassword" autocomplete="off" />
              </a-form-item>
            </template>
            <!-- 新增 -->
            <template v-else>
              <a-form-item label="密码" has-feedback name="password">
                <a-input type="password" v-model:value="userFormState.password" autocomplete="off" />
              </a-form-item>

              <a-form-item label="重复密码" has-feedback name="reNewPassword">
                <a-input type="password" v-model:value="userFormState.reNewPassword" autocomplete="off" />
              </a-form-item>
            </template>
          </a-tab-pane>
          <!-- 简介 -->
          <a-tab-pane key="3" forceRender tab="个人信息">
            <a-form-item label="用户头像" has-feedback name="avatar">
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
                <img v-if="userFormState.avatar" :src="userFormState.avatar" alt="avatar" class="upload-image" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item>

            <a-form-item label="个人简介" has-feedback name="description" placeholder="在这里介绍自己~">
              <a-textarea v-model:value="userFormState.description" :rows="5" />
            </a-form-item>

            <a-form-item label="QQ" has-feedback name="qq" placeholder="请绑定自己的QQ号">
              <a-input v-model:value="userFormState.qq" />
            </a-form-item>

            <a-form-item label="邮箱" has-feedback name="email" placeholder="请绑定自己的邮箱">
              <a-input v-model:value="userFormState.email" />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>
  </div>
</template>
