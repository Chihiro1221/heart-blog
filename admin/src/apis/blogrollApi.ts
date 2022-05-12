import ApiAbstract from "./apiAbstract"
import { UserDocument } from "./userApi"
// @ts-ignore
import { Document } from "#/document"

export interface IBlogroll {
  user?: string | UserDocument
  avatar: string
  site: string
  status?: 0 | 1
  description: string
}

export interface BlogrollDocument extends IBlogroll, Document {}

class Blogroll extends ApiAbstract<IBlogroll> {
  protected url: string = "/blogrolls"
}

const blogrollApi = new Blogroll()

export default blogrollApi
