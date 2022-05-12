import { http } from "@/plugins"
import { List } from "#/document"

abstract class ApiAbstract<T> {
  protected abstract url: string

  // 获取列表
  public getList(query?: any, tree?: boolean) {
    const params = { query: null } as { query: null | any; tree: boolean | null }
    if (query) {
      params.query = query
    }
    if (tree) {
      params.tree = true
    }
    return http.request<List<T>>({
      url: this.url,
      params,
    })
  }

  // 添加菜单
  public add(data: T) {
    return http.request<T>({
      method: "POST",
      url: this.url,
      data,
    })
  }

  // 获取指定id数据
  public getById = (id: string) => {
    return http.request<T>({
      method: "GET",
      url: `${this.url}/${id}`,
    })
  }

  // 更新数据
  public updateById = (id: string, data: { [P in keyof T]?: T[P] }) => {
    const { _id, createAt, updateAt, ...raw } = data as any
    return http.request<T>({
      method: "PUT",
      url: `${this.url}/${id}`,
      data,
    })
  }

  // 删除数据
  public deleteById = (id: string) => {
    return http.request<T>({
      method: "DELETE",
      url: `${this.url}/${id}`,
    })
  }

  // 删除全部
  public deleteList = (ids: string[]) => {
    return http.request<T>({
      method: "DELETE",
      url: this.url,
      data: ids,
    })
  }
}

export default ApiAbstract
