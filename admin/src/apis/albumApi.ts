import { Document } from "#/document"
import ApiAbstract from "@/apis/apiAbstract"
import { TagDocument } from "./tagApi"

export interface IAlbum {
  picture: string
  description?: string
  tags?: (string | TagDocument)[]
  picture_isShow?: boolean
}

export interface AlbumDocument extends IAlbum, Document {}

class Album extends ApiAbstract<AlbumDocument> {
  protected url: string = "/album"
}

const albumApi = new Album()

export default albumApi
