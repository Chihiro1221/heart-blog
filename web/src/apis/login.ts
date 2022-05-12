import { IUser } from '#/responseResult'
import http from '@/plugins/axios'

export interface ILogin {
  username: string
  password: string
}

export const login = (form: ILogin) => {
  return http.request({
    method: 'POST',
    url: 'auth/login',
    data: form,
  })
}

export const getProfile = () => {
  return http.request<IUser>({
    url: 'auth/profile',
  })
}
