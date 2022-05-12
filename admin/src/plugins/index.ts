import { App } from "vue"
import http from "./axios"
import setupPinia from "./pinia"
import setupTailwindCss from "./tailwindcss/index"
import setupVeeValidate from "./veeValidate"
import setupDayjsPlugins from "@/plugins/dayjs"

export default function setupPlugins(app: App) {
  setupTailwindCss()
  setupVeeValidate()
  setupPinia(app)
  setupDayjsPlugins()
}

export { http }
