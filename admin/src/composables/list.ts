import cateApi, { CateDocument } from "@/apis/categoryApi"
import menuApi, { MenuDocument } from "@/apis/menuApi"
import roleApi, { RoleDocument } from "@/apis/roleApi"
import userApi, { UserDocument } from "@/apis/userApi"
import { ref } from "vue"
import tagApi, { TagDocument } from "@/apis/tagApi"
import articleApi, { ArticleDocument } from "@/apis/articleApi"
import menuService from "@/composables/menu"
import albumApi, { AlbumDocument } from "@/apis/albumApi"
import blogrollApi, { BlogrollDocument } from "@/apis/blogrollApi"

export default new (class List {
  public menus = ref<MenuDocument[]>([])
  public filterMenus = ref<MenuDocument[]>([])
  public filterCategories = ref<CateDocument[]>([])
  public roles = ref<RoleDocument[]>([])
  public users = ref<UserDocument[]>([])
  public tags = ref<TagDocument[]>([])
  public categories = ref<CateDocument[]>([])
  public articles = ref<ArticleDocument[]>([])
  public album = ref<AlbumDocument[]>([])
  public blogroll = ref<BlogrollDocument[]>([])
  // 文章总数
  public articleCount = ref<number>()
  // 分页配置
  public paginationOptions

  constructor() {
    this.paginationOptions = ref({
      current: 1,
      pageSize: 10,
      defaultPageSize: 10,
      pageSizeOptions: ["2", "10", "20", "50", "100", "200"],
      showSizeChanger: true,
      total: 0,
      showQuickJumper: true,
    })
  }

  // 过滤三级菜单
  private static filterMenu(menus: any) {
    menus.forEach((menu: { children: any[] }) => {
      menu.children?.forEach((cmenu) => {
        cmenu.children = []
      })
    })
    return menus
  }

  public async init() {
    await this.initMenus()
    await this.initRoles()
    await this.initUsers()
    await this.initCategories()
    await this.initTags()
    await this.initArticles()
    await this.initAlbum()
    await this.initBlogroll()
    // 切换loading状态
    menuService.changeLoading(false)
  }

  // 初始化角色
  public async initRoles() {
    this.roles.value = (await roleApi.getList()).result.data
  }

  // 初始化用户
  public async initUsers() {
    this.users.value = (await userApi.getList({ populate: ["role", "blogroll"] })).result.data
  }

  // 初始化菜单
  public async initMenus() {
    this.menus.value = (await menuApi.getList(null, true)).result as unknown as MenuDocument[]
    this.filterMenus.value = List.filterMenu(this.menus.value)
  }

  // 初始化分类
  public async initCategories() {
    this.categories.value = (await cateApi.getList(null, true)).result as unknown as CateDocument[]
    this.filterCategories.value = List.filterMenu(this.categories.value)
  }

  // 初始化标签
  public async initTags() {
    this.tags.value = (await tagApi.getList()).result.data
  }

  // 初始化文章
  public async initArticles(query?: any) {
    const { data, total } = (await articleApi.getList(query)).result || {}
    data.forEach((item) => (item.cover_isShow = false))
    this.articles.value = data
    this.paginationOptions.value.total = total
    this.articleCount.value = total
  }

  // 初始化相册
  public async initAlbum() {
    const { data, total } = (await albumApi.getList({ populate: "tags" })).result || {}
    data.forEach((item) => (item.picture_isShow = false))
    this.album.value = data
  }

  // 初始化友情链接
  public async initBlogroll() {
    const { data, total } = (await blogrollApi.getList({ populate: "user" })).result || {}
    this.blogroll.value = data
  }
})()
