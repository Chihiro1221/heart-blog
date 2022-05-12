import { reactive, ref } from "vue"
import { BlogrollDocument, IBlogroll } from "@/apis/blogrollApi"
// 表单默认数据
export const blogrollFormState = ref<BlogrollDocument>({
  avatar: "",
  description: "",
  site: "",
})
// 表单校验规则
export const blogrollRules = reactive({
  user: {
    required: true,
    message: "请选择用户",
    trigger: "blur",
  },
  site: [
    {
      required: true,
      message: "请输入网站地址",
      trigger: "blur",
    },
    {
      pattern:
        /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/,
      message: "请输入http正确网址格式",
      trigger: "blur",
    },
  ],
  avatar: [
    {
      required: true,
      message: "请上传头像",
      trigger: "blur",
    },
  ],
})
// 表格配置
export const blogrollColumns = reactive([
  { title: "站友昵称", dataIndex: "user", slots: { customRender: "user" }, align: "center" },
  {
    title: "网站地址",
    dataIndex: "site",
    slots: { customRender: "site" },
    align: "center",
  },
  {
    title: "启用状态",
    dataIndex: "status",
    slots: { customRender: "status" },
    align: "center",
  },
  {
    title: "简介",
    dataIndex: "description",
    slots: { customRender: "description" },
    align: "center",
  },
  {
    title: "站友头像",
    dataIndex: "avatar",
    slots: { customRender: "avatar" },
    align: "center",
  },
  {
    title: "操作",
    slots: { customRender: "action" },
    align: "center",
  },
])
