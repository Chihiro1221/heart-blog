import { MenuDocument } from './menuApi'
import { Document } from '#/document'
import ApiAbstract from '@/apis/apiAbstract'

export interface IRole {
  name: string
  nickname: string
  menu_id?: string[] | MenuDocument[]
}

export interface RoleDocument extends IRole, Document {}

class Role extends ApiAbstract<RoleDocument> {
  protected url: string = '/roles'
}

const roleApi = new Role()

export default roleApi
