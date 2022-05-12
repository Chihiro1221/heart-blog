import { RoleDocument } from "@/apis/roleApi"
import { reactive, ref } from "vue"
// 表单默认数据
export const roleFormState = ref<RoleDocument>({
  name: "",
  nickname: "",
})

// 表单校验规则
export const roleRules = reactive({
  name: {
    required: true,
    message: "角色名称是必须的",
    trigger: "blur",
  },
  nickname: {
    required: true,
    message: "角色昵称是必须的",
    trigger: "blur",
  },
})

// 角色配置
export const roleColumns = reactive([
  {
    title: "角色名称",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
  {
    title: "角色昵称",
    dataIndex: "nickname",
  },
  {
    title: "操作",
    slots: { customRender: "action" },
  },
])
