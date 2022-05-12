import { MenuDocument } from "@/apis/menuApi"
import { reactive, ref } from "vue"

// 表单默认数据
export const menuFormState = ref<MenuDocument>({
  name: "",
  control_url: "",
  page_url: "",
  parent: null,
  level: 1,
  is_show: 0,
  is_enabled: 0,
})

// 表单校验规则
export const menuRules = reactive({
  name: {
    required: true,
    message: "菜单名称是必须的",
    trigger: "blur",
  },
  page_url: {
    required: true,
    message: "页面地址是必须的",
    trigger: "blur",
  },
})

// 菜单配置
export const menuColumns = reactive([
  {
    title: "菜单名称",
    dataIndex: "name",
    width: "30%",
    slots: { customRender: "name" },
  },
  {
    title: "页面地址",
    dataIndex: "page_url",
  },
  {
    title: "控件地址",
    dataIndex: "control_url",
  },
  {
    title: "层级",
    dataIndex: "level",
    slots: { customRender: "tags" },
  },

  {
    title: "是否显示",
    dataIndex: "is_show",
    slots: { customRender: "is_show" },
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
