import { TagDocument } from "@/apis/tagApi"
import { reactive, ref } from "vue"
// 表单默认数据
export const tagFormState = ref<TagDocument>({
  name: "",
  is_enabled: 1,
})

// 表单校验规则
export const tagRules = reactive({
  name: {
    required: true,
    message: "标签名称是必须的",
    trigger: "blur",
  },
})
// 标签配置
export const tagColumns = reactive([
  { title: "标签名称", dataIndex: "name", slots: { customRender: "name" }, align: "center" },
  {
    title: "是否启用",
    dataIndex: "is_enabled",
    slots: { customRender: "is_enabled" },
    align: "center",
  },
  {
    title: "主题颜色",
    dataIndex: "color",
    slots: { customRender: "color" },
    align: "center",
  },
  {
    title: "操作",
    slots: { customRender: "action" },
    align: "center",
  },
])
