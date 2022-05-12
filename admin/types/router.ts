import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    menu?: {
      title: string
      icon?: string
    }
    permission?: {
      page_url: string
      isForbidden?: boolean
    }
    // 只有游客才可以访问
    guest?: boolean
  }
}
