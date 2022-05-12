import menuService from "@/composables/menu"
import { cacheEnum } from "@/enum/cacheEnum"
import { ResponseResult } from "#/responseResult"
import { message } from "ant-design-vue"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { utils } from "@/utils"
import { Router, useRouter } from "vue-router"
import router from "@/router"

export default class {
  public instance: AxiosInstance
  private router: Router = useRouter()
  public config: AxiosRequestConfig

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.config = config
    this.interceptors()
  }

  public request<T, R = ResponseResult<T>>(config: AxiosRequestConfig) {
    return new Promise(async (resolve, reject) => {
      const res = await this.instance.request<R>(config)
      resolve(res.data)
    }) as Promise<R>
  }

  // 初始化拦截器
  private interceptors() {
    this.requestInterceptor()
    this.responseInterceptor()
  }

  private requestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        const data = utils.store.get(cacheEnum.TOKEN)!
        config.headers!.Authorization = "Bearer " + data?.cache.token
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  private responseInterceptor() {
    this.instance.interceptors.response.use(
      (config) => {
        return config
      },
      (error) => {
        menuService.changeLoading(false)
        const res = error.response?.data
        message.error(res?.message)
        if (res?.message === "Unauthorized") {
          utils.store.remove(cacheEnum.TOKEN)
          void router.push("/login")
        }
        return Promise.reject(error.message)
      }
    )
  }
}
