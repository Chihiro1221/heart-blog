import { Router } from 'vue-router'
import { authStore } from '@/store/auth'
import autoRegistryRoute from './autoRegistry'

let routes = autoRegistryRoute()
export default function autoload(router: Router) {
  const user = authStore()
  routes.forEach(route => {
    router.removeRoute(route.name!)
    route.children?.forEach(croute => {
      const currentRoute = user.profile.role?.menu_id?.some((menu: any) => menu.page_url === croute.meta?.permission?.page_url)
      if (!currentRoute) {
        croute.meta!.permission!.isForbidden = true
      } else {
        croute.meta!.permission!.isForbidden = false
      }
    })
    router.addRoute(route)
  })
}
