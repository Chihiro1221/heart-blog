import { ICate, ListResult } from '#/responseResult'
import http from '@/plugins/axios'

export const fetchCategories = async () => {
  return http.request<ListResult<ICate[]>>({
    url: 'categories',
  })
}
