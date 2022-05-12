import { CateDocument } from "@/apis/categoryApi"
import { Document } from "#/document"
import ApiAbstract from "@/apis/apiAbstract"
import { Status } from "@/enum/apiEnum"
import { UserDocument } from "./userApi"
import { TagDocument } from "./tagApi"
import { http } from "@/plugins"
import { ActionDocument } from "#/action"

export interface IArticle {
  title: string
  content: string | null
  status: Status
  is_stick: 1 | 0
  cover: string
  author?: UserDocument | string
  category?: CateDocument
  tags?: (TagDocument | string)[]
  cover_isShow?: boolean
  likes?: ActionDocument[]
  comments?: ActionDocument[]
  browsers?: ActionDocument[]
  collects?: ActionDocument[]
}

export interface ArticleDocument extends IArticle, Document {}

class Article extends ApiAbstract<ArticleDocument> {
  protected url: string = "/articles"

  // 彻底删除
  public confirmedDeleteMany(data: string[]) {
    return http.request({
      url: this.url + "/deleteMany",
      method: "DELETE",
      data,
    })
  }
}

const articleApi = new Article()
export default articleApi
