import { RouteLocationNormalized } from "vue-router"
import router from "@/router"
import { ref } from "vue"
import { utils } from "@/utils"
import { cacheEnum } from "@/enum/cacheEnum"

export interface ShowMenu {
  title: string
  path: string
  name: string
  icon?: string
  isActive?: boolean
  children?: (ShowMenu | null)[]
}

class Menu {
  public collapsed = ref<boolean>(false)
  public isDark = ref<boolean>(true)
  public isLoading = ref<boolean>(true)
  public menus = ref<ShowMenu[]>([])
  public historyLink = ref<ShowMenu[]>(utils.store.get(cacheEnum.HISTORY_LINK)?.cache || [])

  // 切换收缩状态
  public toggle() {
    this.collapsed.value = !this.collapsed.value
  }

  // 取消loading状态
  public changeLoading(state: boolean) {
    this.isLoading.value = state
  }

  // 切换主题色
  public toggleTheme() {
    this.isDark.value = !this.isDark.value
  }

  // 初始化菜单
  public initMenus() {
    this.menus.value = []
    const routes = router.getRoutes()
    routes.forEach((route) => {
      if (route.children.length) {
        const menu: ShowMenu = {
          path: route.path,
          title: route.meta.menu?.title!,
          name: route.name as string,
          icon: route.meta.menu?.icon!,
          children: [],
        }
        route.children.forEach((croute) => {
          if (croute.meta?.menu && !croute.meta.permission?.isForbidden) {
            menu.children?.push({
              path: `${route.path}/${croute.path}`,
              title: croute.meta.menu.title,
              name: croute.name,
            } as ShowMenu)
          }
        })
        this.menus.value.push(menu)
      }
    })
  }

  // 添加历史菜单
  public addHistoryLink(route: RouteLocationNormalized) {
    this.clearActiveState()
    const currentLink = this.historyLink.value?.find((link) => link.name === route.name)
    if (currentLink) {
      currentLink.isActive = true
      return
    }
    const link = { title: route.meta.menu?.title, name: route.name, path: route.path, isActive: true } as ShowMenu
    if (this.historyLink.value?.length > 10) {
      this.historyLink.value.pop()
    }
    this.historyLink.value?.unshift(link)
    utils.store.set(cacheEnum.HISTORY_LINK, this.historyLink.value)
  }

  // 清除激活状态
  public clearActiveState() {
    this.historyLink.value?.forEach((link) => (link.isActive = false))
  }

  // 删除历史菜单
  public removeHistory(link: ShowMenu, index: number) {
    this.historyLink.value.splice(index, 1)
    utils.store.set(cacheEnum.HISTORY_LINK, this.historyLink.value)
  }
}

export default new Menu()
