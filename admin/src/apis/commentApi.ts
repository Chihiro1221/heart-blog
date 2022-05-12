import { Document } from "#/document"
import ApiAbstract from "@/apis/apiAbstract"
import { UserDocument } from "./userApi"
import { ActionDocument } from "#/action"
import { ArticleDocument } from "./articleApi"

export interface IComment {
  user?: UserDocument
  content: string
  action_object_type: string
  object_id: string | ArticleDocument
  parent?: string
  children?: CommentDocument[]
  likes?: ActionDocument[]
  is_show?: 0 | 1
}

export interface CommentDocument extends IComment, Document {}

class Comment extends ApiAbstract<IComment> {
  protected url: string = "/comments"
}

const commentApi = new Comment()

export default commentApi
