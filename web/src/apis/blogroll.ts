import http from '@/plugins/axios';
import { IBlogRoll, ListResult } from '#/responseResult';
import { Query } from '#/requestParams';

export interface BlogRoll {
  avatar: string;
  site: string;
  description?: string;
  user?: string;
  status?: 0 | 1;
}

export const getBlogroll = async (query?: Query) => {
  return http.request<ListResult<IBlogRoll[]>>({
    url: 'blogrolls',
    params: {
      query
    }
  });

};

export const createBlogroll = (data: BlogRoll) => {
  return http.request({
    url: '/blogrolls',
    method: 'post',
    data
  });
};

export const updateBlogroll = (id: string, data: BlogRoll) => {
  return http.request({
    url: `/blogrolls/${id}`,
    method: 'PUT',
    data
  });
};
