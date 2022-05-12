import { CateDocument } from "@/apis/categoryApi"
import { reactive, ref } from "vue"
// 表单默认数据
export const cateFormState = ref<CateDocument>({
  name: "",
  is_enabled: 1,
})

// 表单校验规则
export const cateRules = reactive({
  name: {
    required: true,
    message: "分类名称是必须的",
    trigger: "blur",
  },
})

// 分类配置
export const cateColumns = reactive([
  {
    title: "分类名称",
    dataIndex: "name",
    width: "30%",
    slots: { customRender: "name" },
  },
  {
    title: "是否启用",
    dataIndex: "is_enabled",
    slots: { customRender: "is_enabled" },
  },
  {
    title: "操作",
    slots: { customRender: "action" },
  },
])
