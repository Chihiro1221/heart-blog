import { Document } from '#/document'
import ApiAbstract from '@/apis/apiAbstract'

export interface ICate {
  name: string
  parent?: string
  children?: ICate[]
  is_enabled: 1 | 0
}

export interface CateDocument extends ICate, Document {}

class Cate extends ApiAbstract<CateDocument> {
  protected url: string = '/categories'
}

const cateApi = new Cate()

export default cateApi
