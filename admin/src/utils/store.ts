import { cacheEnum } from "@/enum/cacheEnum"

export interface IStoreData {
  expire?: number
  [key: string]: any
}
export default class {
  private data: IStoreData = {}

  // 设置
  set(name: string, dto: any, expire?: number) {
    if (expire) {
      this.data.expire = Date.now() + expire * 1000 * 60 * 60
    }
    this.data.cache = dto
    localStorage.setItem(name, JSON.stringify(this.data))
  }

  // 获取
  get(name: string) {
    const data = JSON.parse(localStorage.getItem(name)!) as IStoreData
    if (data?.expire) {
      if (Date.now() - data.expire > 0) {
        localStorage.removeItem(name)
        return null
      }
    }
    return data
  }

  remove(name: cacheEnum) {
    localStorage.removeItem(name)
  }
}
