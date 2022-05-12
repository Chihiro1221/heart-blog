import { IStoreData } from "@/utils/store"
import { cacheEnum } from "@/enum/cacheEnum"
import { utils } from "@/utils"
import { RouteLocationNormalized, Router } from "vue-router"
import { message } from "ant-design-vue"
import menuService from "@/composables/menu"
export default class Guard {
  constructor(private router: Router) {
    this.setGuard()
  }

  private setGuard() {
    this.router.beforeEach(Guard.beforeEach.bind(this))
  }

  private static beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const token = utils.store.get(cacheEnum.TOKEN)?.cache
    if (!Guard.validateToekn(to, token!)) return "/login"
    if (!Guard.validateGuest(to, token!)) return from
    if (!Guard.validatePermission(to)) return from
    // 添加历史菜单
    if (to.meta.menu) menuService.addHistoryLink(to)
  }

  // 验证token
  private static validateToekn(to: RouteLocationNormalized, token: IStoreData) {
    if (to.path === "/login") return true
    if (token) return true
    message.warning("请您登录!")
    return false
  }

  // 验证游客
  private static validateGuest(to: RouteLocationNormalized, token: IStoreData) {
    if (to.meta.guest) return !token
    return true
  }

  // 验证权限
  private static validatePermission(to: RouteLocationNormalized) {
    if (to.meta.permission?.isForbidden) {
      message.warning("您无权访问!")
      return false
    } else {
      return true
    }
  }
}
