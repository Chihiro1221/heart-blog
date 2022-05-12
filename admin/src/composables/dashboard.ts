import listService from "@/composables/list"
import actionApi from "@/apis/actionApi"
import { ref } from "vue"
import commentApi from "@/apis/commentApi"
interface IDashboardData {
  title: string
  desc: string
  numerical: number
  icon: string
  icon_color: string
}
export default new (class {
  public dashboardData = ref<IDashboardData[]>([])
  constructor() {
    this.init()
  }

  async init() {
    this.dashboardData.value = await this.initDataboardData()
  }

  // 初始化仪表盘数据
  public async initDataboardData(): Promise<IDashboardData[]> {
    return [
      {
        title: "浏览量",
        desc: "总浏览量",
        numerical: await this.initBrowses(),
        icon: "fa-brands fa-firefox-browser",
        icon_color: "#ff4757",
      },
      {
        title: "点赞量",
        desc: "点赞人数",
        numerical: await this.initLikes(),
        icon: "fa-solid fa-thumbs-up",
        icon_color: "#2ed573",
      },
      {
        title: "文章量",
        desc: "总文章数",
        numerical: await this.initArticles(),
        icon: "fa-solid fa-paste",
        icon_color: "#1e90ff",
      },
      {
        title: "收藏量",
        desc: "总收藏数",
        numerical: await this.initCollects(),
        icon: "fab fa-gratipay",
        icon_color: "#e67e22",
      },
    ]
  }

  // 获取浏览量
  public async initBrowses() {
    const { result } = (await actionApi.getList({ where: { action_type: "Browse" } })) || {}
    return result.total
  }

  // 获取点赞量
  public async initLikes() {
    const { result } = (await actionApi.getList({ where: { action_type: "Like" } })) || {}
    return result.total
  }

  // 获取收藏量
  public async initCollects() {
    const { result } = (await actionApi.getList({ where: { action_type: "Collect" } })) || {}
    return result.total
  }

  // 获取文章量
  public async initArticles() {
    await listService.initArticles()
    return listService.articleCount.value!
  }

  // 获取评论量
  public async initComments() {
    const { result } = (await commentApi.getList()) || {}
    return result.total
  }
})()
