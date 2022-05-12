import { Document } from '#/document'
import ApiAbstract from '@/apis/apiAbstract'

export interface IUser {
  username: string
  password?: string
  nickname: string
  avatar?: string
  description?: string
  qq?: string
  email?: string
  role?: string
  rawPassword?: string
  reNewPassword?: string
  is_enabled?: boolean
}
export interface UserDocument extends IUser, Document {}

class User extends ApiAbstract<UserDocument> {
  protected url: string = '/users'
}

const userApi = new User()
export default userApi
