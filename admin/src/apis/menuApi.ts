import ApiAbstract from '@/apis/apiAbstract'
import { Document } from '#/document'

export interface IMenu {
  name: string
  page_url: string
  control_url: string
  parent?: string | null
  children?: MenuDocument[]
  level: number
  is_show: 0 | 1
  is_enabled: 0 | 1
}

export interface MenuDocument extends IMenu, Document {}

class Menu extends ApiAbstract<MenuDocument> {
  protected url: string = '/menus'
}

const menuApi = new Menu()
export default menuApi
