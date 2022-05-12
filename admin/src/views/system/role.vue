<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import roleApi from "@/apis/roleApi"
import { roleColumns } from "@/rules/roleRules"
import { roleFormState } from "@/rules/roleRules"
import listService from "@/composables/list"
import rules from "@/rules"

const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
// 多选数组
const selectRowKeys = ref<string[]>()

// 编辑
const edit = async (id: string) => {
  const res = (await roleApi.getById(id)).result
  visible.value = true
  roleFormState.value = { ...roleFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
  roleFormState.value = {
    name: "",
    nickname: "",
  }
}
// 删除
const remove = async (id: string) => {
  const res = (await roleApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    listService.initRoles()
  }
}

// 验证成功
const onFinish = async () => {
  formRef.value.validate()
  confirmLoading.value = true
  let res
  if (roleFormState.value._id) {
    res = (await roleApi.updateById(roleFormState.value._id, { ...roleFormState.value })).result
  } else {
    res = (await roleApi.add(roleFormState.value)).result
  }
  if (res) {
    confirmLoading.value = false
    visible.value = false
    message.success("编辑成功")
    listService.initRoles()
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
  const res = (await roleApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功")
    listService.initRoles()
  }
}
// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})
</script>
<template>
  <div v-if="listService.roles?.value?.length" class="menu-container">
    <a-table
      :columns="roleColumns"
      :data-source="listService.roles.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">角色管理</h1>
          <a-button type="primary" @click="add">新增</a-button>
          <a-button :disabled="deleteManyState" class="mt-2" danger type="primary" @click="deleteMany">删除所选</a-button>
        </div>
      </template>
      <template #name="{ text: name, record: row }">
        <a-button type="link" @click="edit(row._id)">{{ name }}</a-button>
      </template>
      <template #tags="{ text: tags }">
        <a-badge v-if="tags === 1" :count="tags" :number-style="{ backgroundColor: '#2db7f5' }" />
        <a-badge v-else-if="tags === 2" :count="tags" :number-style="{ backgroundColor: '#f50' }" />
        <a-badge v-else :count="tags" :number-style="{ backgroundColor: '#9b59b6' }" />
      </template>
      <template #action="{ text: row }">
        <a-button size="small" type="link" @click="edit(row._id)">编辑</a-button>
        <a-popconfirm cancel-text="取消" ok-text="确认" title="确认删除这个菜单吗" @cancel="cancelDelete" @confirm="remove(row._id)">
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
        :label-col="{ span: 4 }"
        :model="roleFormState"
        :rules="rules.role"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
        @finish="onFinish"
      >
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="roleFormState.name" />
        </a-form-item>

        <a-form-item label="角色昵称" name="nickname">
          <a-input v-model:value="roleFormState.nickname" />
        </a-form-item>

        <a-form-item has-feedback label="权限列表" name="parent" placeholder="请分配权限">
          <a-tree-select
            v-model:value="roleFormState.menu_id"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :replaceFields="{
              children: 'children',
              label: 'name',
              key: 'key',
              value: '_id',
            }"
            :tree-data="listService.menus.value"
            tree-checkable
            allow-clear
            placeholder="请分配权限"
            show-search
            style="width: 100%"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
