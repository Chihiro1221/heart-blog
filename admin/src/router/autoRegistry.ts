import { RouteRecordRaw } from 'vue-router'
export default function autoRegistryRoute() {
  const modules = import.meta.globEager('./modules/*.ts')
  const routes: RouteRecordRaw[] = []
  Object.entries(modules).forEach(([key, value]) => {
    routes.push(...value.default)
  })
  return routes
}
