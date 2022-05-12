import { cacheEnum } from "@/enum/cacheEnum"
import { utils } from "@/utils"
import { authStore } from "@/store/auth"
import { App } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import Guard from "./guard"
import routes from "./routes"
import autoRegistryRoute from "./autoRegistry"
import autoload from "./autoload"
import menuService from "@/composables/menu"

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...autoRegistryRoute()],
})

export async function setupRouter(app: App) {
  await authStore().getProfile(utils.store.get(cacheEnum.TOKEN)?.cache.token)
  autoload(router)
  await menuService.initMenus()
  new Guard(router)
  app.use(router)
}
export default router
