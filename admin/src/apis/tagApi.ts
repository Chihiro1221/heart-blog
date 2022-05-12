import { Document } from "#/document"
import ApiAbstract from "@/apis/apiAbstract"

export interface ITag {
  name: string
  color?: string
  is_enabled: 1 | 0
}

export interface TagDocument extends ITag, Document {}

class Tag extends ApiAbstract<TagDocument> {
  protected url: string = "/tags"
}

const tagApi = new Tag()

export default tagApi
