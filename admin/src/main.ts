import menuService from "@/composables/menu"
import { createApp } from "vue"
import App from "./App.vue"
import setupPlugins from "./plugins"
import router, { setupRouter } from "./router"
import "./assets/global.scss"
// import "ant-design-vue/dist/antd.css" // or 'ant-design-vue/dist/antd.less'
import listService from "@/composables/list"
import { utils } from "./utils"
import { cacheEnum } from "./enum/cacheEnum"
import { V3ColorPicker } from "v3-color-picker"

async function bootstrap() {
  const token = utils.store.get(cacheEnum.TOKEN)
  const app = createApp(App)
  setupPlugins(app)
  // 颜色选择器
  app.component("v3-color-picker", V3ColorPicker) // 只注册组件
  await setupRouter(app)
  await router.isReady()
  await app.mount("#app")
  if (token) {
    menuService.changeLoading(true)
    await listService.init()
  }
}

void bootstrap()
