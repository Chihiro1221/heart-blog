import http from '@/plugins/axios';
import { IAction, IUser } from '#/responseResult';

export interface UserBasic {
  nickname: string;
  qq: number;
  email: string;
  description: string;
  avatar: string;
  blogroll?: any;
}

/**
 * 更新用户基本信息
 * @param id 用户id
 * @param dto 更新信息
 */
export const updateUserBasic = (id: string, dto: UserBasic) => {
  return http.request({
    url: `/users/${id}`,
    method: 'put',
    data: dto
  });
};

/**
 * 获取用户收藏信息
 * @param id
 */
export const getUserCollection = (id: string) => {
  return http.request<IAction[]>({
    url: `users/collection/${id}`
  });
};

/**
 * 更新用户收藏信息
 * @param id
 * @param data
 */
export const updateUserCollection = (id: string, data: any) => {
  return http.request({
    url: `users/collection/${id}`,
    method: 'put',
    data
  });
};

export const getUserProfileById = (id: string) => {
  return http.request<IUser>({
    url: `/users/${id}`
  });
};