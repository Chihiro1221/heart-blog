<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import rules from "@/rules"
import listService from "@/composables/list"
import tagApi from "@/apis/tagApi"
import { tagFormState } from "@/rules/tagRules"
import { tagColumns } from "@/rules/tagRules"

const tableLoading = ref<boolean>(false)
const formRef = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
// 多选数组
const selectRowKeys = ref<string[]>()
// 编辑
const edit = async (id: string) => {
  const res = (await tagApi.getById(id)).result
  visible.value = true
  tagFormState.value = { ...tagFormState.value, ...res }
}
// 新增
const add = async () => {
  visible.value = true
  tagFormState.value = {
    name: "",
    is_enabled: 1,
  }
}
// 删除
const remove = async (id: string) => {
  const res = (await tagApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    await listService.initTags()
  }
}

// 验证成功
const onFinish = async () => {
  formRef.value.validate().then(async (_: any) => {
    confirmLoading.value = true
    let res
    if (tagFormState.value._id) {
      res = (await tagApi.updateById(tagFormState.value._id, { ...tagFormState.value })).result
    } else {
      res = (await tagApi.add(tagFormState.value)).result
    }
    if (res) {
      confirmLoading.value = false
      visible.value = false
      message.success("编辑成功")
      await listService.initTags()
      await listService.initArticles()
    }
  })
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
  const res = (await tagApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.error("批量删除成功")
    await listService.initTags()
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
      :columns="tagColumns"
      :data-source="listService.tags.value"
      :indentSize="50"
      :loading="tableLoading"
      :row-selection="rowSelection"
      defaultExpandAllRows
      rowKey="_id"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">标签管理</h1>
          <a-button type="primary" @click="add">新增</a-button>
          <a-button :disabled="deleteManyState" class="mt-2" danger type="primary" @click="deleteMany">删除所选</a-button>
        </div>
      </template>

      <template #name="{ text: name, record: row }">
        <a-button type="link" @click="edit(row._id)">{{ name }}</a-button>
      </template>

      <template #color="{ text: color }">
        <div class="max-w-[30px] h-[30px] rounded-full" :style="{ backgroundColor: color, margin: '0 auto' }"></div>
      </template>

      <template #is_enabled="{ text: is_enabled }">
        <a-badge :color="is_enabled ? 'green' : 'red'" :text="is_enabled ? '启用' : '禁用'" />
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
        :label-col="{ span: 4 }"
        :model="tagFormState"
        :rules="rules.tag"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        name="basic"
        @finish="onFinish"
      >
        <a-form-item label="标签名称" name="name">
          <a-input v-model:value="tagFormState.name" />
        </a-form-item>

        <a-form-item label="选择颜色" name="color">
          <v3-color-picker btn v-model:value="tagFormState.color" :zIndex="99999"></v3-color-picker>
        </a-form-item>

        <a-form-item has-feedback label="是否启用" name="is_enabled">
          <a-switch v-model:checked="tagFormState.is_enabled" :checkedValue="1" :unCheckedValue="0" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
