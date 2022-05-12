<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import { menuColumns } from "@/rules/menuRules"
import menuApi, { MenuDocument } from "@/apis/menuApi"
import listService from "@/composables/list"
import { menuFormState } from "@/rules/menuRules"
import rules from "@/rules"

const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

// 编辑
const edit = async (id: string) => {
  const res = (await menuApi.getById(id)).result
  visible.value = true
  menuFormState.value = { ...menuFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
  menuFormState.value = {
    name: "",
    control_url: "",
    page_url: "",
    parent: null,
    level: 1,
    is_show: 0,
    is_enabled: 0,
  }
}
// 删除
const remove = async (id: string) => {
  const res = (await menuApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    listService.initMenus()
  }
}

// 验证成功
const onFinish = async () => {
  formRef.value.validate()
  confirmLoading.value = true
  let res
  if (menuFormState.value._id) {
    res = (await menuApi.updateById(menuFormState.value._id, { ...menuFormState.value })).result
  } else {
    res = (await menuApi.add(menuFormState.value)).result
  }
  if (res) {
    confirmLoading.value = false
    visible.value = false
    message.success("编辑成功")
    listService.initMenus()
  }
}
// 取消操作
const cancel = () => {
  formRef.value.resetFields()
}

// 多选数组
const selectRowKeys = ref<string[]>()

const rowSelection = {
  // 选中事件
  onChange: (selectedRowKeys: string[]) => {
    selectRowKeys.value = selectedRowKeys
  },
  // 默认配置
  getCheckboxProps: (record: MenuDocument) => ({
    disabled: record.name === "菜单管理",
    name: record.name,
  }),
}
const cancelDelete = () => {
  message.info("取消删除")
}
// 删除所选
const deleteMany = async () => {
  const res = (await menuApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功")
    listService.initMenus()
  }
}
// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})
</script>
<template>
  <div v-if="listService?.menus.value.length" class="menu-container">
    <a-table
      :columns="menuColumns"
      :data-source="listService?.menus.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">菜单管理</h1>
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
      <template #is_show="{ text: is_show }">
        <a-tag v-if="is_show === 1" color="processing">启用</a-tag>
        <a-tag v-else color="error">关闭</a-tag>
      </template>
      <template #is_enabled="{ text: is_enabled }">
        <a-tag v-if="is_enabled === 1" color="processing">启用</a-tag>
        <a-tag v-else color="error">关闭</a-tag>
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
        :model="menuFormState"
        :rules="rules.menu"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
        @finish="onFinish"
      >
        <a-form-item label="菜单名称" name="name">
          <a-input v-model:value="menuFormState.name" />
        </a-form-item>

        <a-form-item has-feedback label="上级菜单" name="parent" placeholder="请选择上级分类">
          <a-tree-select
            v-model:value="(menuFormState.parent as string)"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :replaceFields="{
              children: 'children',
              label: 'name',
              key: 'key',
              value: '_id',
            }"
            :tree-data="listService?.filterMenus.value"
            allow-clear
            placeholder="请选择上级分类"
            show-search
            style="width: 100%"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item label="页面地址" name="page_url">
          <a-input v-model:value="menuFormState.page_url" />
        </a-form-item>

        <a-form-item label="控件地址" name="control_url">
          <a-input v-model:value="menuFormState.control_url" />
        </a-form-item>

        <a-form-item label="是否启用" name="is_enabled">
          <a-switch v-model:checked="menuFormState.is_enabled" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>

        <a-form-item label="是否显示" name="is_show">
          <a-switch v-model:checked="menuFormState.is_show" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
