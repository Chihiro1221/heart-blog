import { UserProfile } from '../store/auth'
import { http } from '@/plugins'

export interface Login {
  username: string
  password: string
}

export interface Token {
  token: string
}

// 登录
export const login = (form: Login) => {
  return http.request<Token>({
    url: 'auth/login',
    method: 'post',
    data: form,
  })
}

// 获取个人信息
export const getProfile = () => {
  return http.request<UserProfile>({
    url: 'auth/profile',
  })
}
