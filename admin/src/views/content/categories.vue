<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import cateApi from "@/apis/categoryApi"
import { cateFormState } from "@/rules/cateRules"
import rules from "@/rules"
import listService from "@/composables/list"
import { cateColumns } from "@/rules/cateRules"

const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
// 多选数组
const selectRowKeys = ref<string[]>()

// 编辑
const edit = async (id: string) => {
  const res = (await cateApi.getById(id)).result
  visible.value = true
  cateFormState.value = { ...cateFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
  cateFormState.value = {
    name: "",
    is_enabled: 1,
  }
}
// 删除
const remove = async (id: string) => {
  const res = (await cateApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    await listService.initCategories()
  }
}

// 验证成功
const onFinish = async () => {
  formRef.value.validate()
  let res
  if (cateFormState.value._id) {
    res = (await cateApi.updateById(cateFormState.value._id, { ...cateFormState.value })).result
  } else {
    res = (await cateApi.add(cateFormState.value)).result
  }
  if (res) {
    visible.value = false
    message.success("编辑成功")
    await listService.initCategories()
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
  const res = (await cateApi.deleteList(selectRowKeys.value!)).result
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
      :columns="cateColumns"
      :data-source="listService.categories.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">分类管理</h1>
          <a-button type="primary" @click="add">新增</a-button>
          <a-button :disabled="deleteManyState" class="mt-2" danger type="primary" @click="deleteMany">删除所选</a-button>
        </div>
      </template>

      <template #name="{ text: name, record: row }">
        <a-button type="link" @click="edit(row._id)">{{ name }}</a-button>
      </template>

      <template #is_enabled="{ text: is_enabled }">
        <a-badge :color="is_enabled ? 'green' : 'red'" :text="is_enabled ? '启用' : '禁用'" />
      </template>

      <template #action="{ text: row }">
        <a-button size="small" type="link" @click="edit(row._id)">编辑</a-button>
        <a-popconfirm cancel-text="取消" ok-text="确认" title="确认删除这个菜单吗" @cancel="cancelDelete" @confirm="remove(row._id)">
          <a-button class="ml-2" danger size="small" type="text">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" :width="650" cancelText="取消" okText="确认" title="添加菜单" @cancel="cancel" @ok="onFinish">
      <a-form
        ref="formRef"
        :label-col="{ span: 4 }"
        :model="cateFormState"
        :rules="rules.role"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
        @finish="onFinish"
      >
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="cateFormState.name" />
        </a-form-item>

        <a-form-item has-feedback label="分类列表" name="parent" placeholder="请选择上级分类">
          <a-tree-select
            v-model:value="cateFormState.parent"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :replaceFields="{
              children: 'children',
              label: 'name',
              key: 'key',
              value: '_id',
            }"
            :tree-data="listService.filterCategories.value"
            allow-clear
            placeholder="请选择上级分类"
            show-search
            style="width: 100%"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item has-feedback label="是否启用" name="is_enabled">
          <a-switch v-model:checked="cateFormState.is_enabled" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
