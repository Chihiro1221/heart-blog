import { UserDocument } from "@/apis/userApi"
import { ActionEnum, ActionObjectEnum } from "@/enum/actionEnum"
import { Document } from "./document"

export interface IAction {
  action_object_type: ActionObjectEnum
  object_id: string
  action_type: ActionEnum
  user?: UserDocument
  is_show?: 0 | 1
  content?: string
  likes?: ActionDocument[]
  status?: 0 | 1
  children?: ActionDocument[]
}

export interface ActionDocument extends IAction, Document {}
