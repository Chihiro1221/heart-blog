import { AlbumDocument } from "@/apis/albumApi"
import { RuleObject } from "ant-design-vue/lib/form/interface"
import { reactive, ref } from "vue"
// 表单默认数据
export const albumFormState = ref<AlbumDocument>({
  picture: "",
})
// 表单校验规则
export const albumRules = reactive({
  picture: [
    {
      required: true,
      message: "图片是必须的",
      trigger: "blur",
    },
  ],
})
// 表格配置
export const albumColumns = reactive([
  { title: "图片", dataIndex: "picture", slots: { customRender: "picture" }, align: "center" },
  {
    title: "标签",
    dataIndex: "tags",
    slots: { customRender: "tags" },
    align: "center",
  },
  {
    title: "简介",
    dataIndex: "description",
    slots: { customRender: "description" },
    align: "center",
  },
  {
    title: "操作",
    slots: { customRender: "action" },
    align: "center",
  },
])
