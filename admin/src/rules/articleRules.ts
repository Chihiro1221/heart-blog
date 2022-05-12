import { ArticleDocument } from "@/apis/articleApi"
import { Status } from "@/enum/apiEnum"
import { reactive, ref } from "vue"
import dayjs from "dayjs"
// 表单默认数据
export const articleFormState = ref<ArticleDocument>({
  title: "",
  content: null,
  status: Status.DRAFT,
  is_stick: 0,
  cover: "",
})

// 表单校验规则
export const articleRules = reactive({
  title: {
    required: true,
    message: "文章标题是必须的",
    trigger: "blur",
  },
  content: {
    required: true,
    message: "请填写文章内容",
    trigger: "blur",
  },
})
// 文章配置
export const articleColumns = reactive([
  {
    title: "文章标题",
    dataIndex: "title",
    slots: { customRender: "a_title" },
    width: "15%",
    ellipsis: true,
    fixed: "left",
  },
  { title: "分类", dataIndex: "category", slots: { customRender: "category" } },
  { title: "标签", dataIndex: "tags", slots: { customRender: "tags" } },
  { title: "状态", dataIndex: "status", slots: { customRender: "status" } },
  { title: "点赞", dataIndex: "likes", slots: { customRender: "likes" } },
  { title: "评论", dataIndex: "comments", slots: { customRender: "comments" } },
  { title: "浏览", dataIndex: "browsers", slots: { customRender: "browsers" } },
  { title: "收藏", dataIndex: "collects", slots: { customRender: "collects" } },
  { title: "封面", dataIndex: "cover", slots: { customRender: "cover" }, width: "150px" },
  { title: "作者", dataIndex: "author", slots: { customRender: "author" } },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    slots: { customRender: "createdAt" },
    align: "center",
    sorter: (a: ArticleDocument, b: ArticleDocument) => {
      return Number(dayjs(a.createdAt)?.valueOf()) - Number(dayjs(b.createdAt)?.valueOf())
    },
  },
  {
    title: "操作",
    slots: { customRender: "action" },
    align: "center",
  },
])
