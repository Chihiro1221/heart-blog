import http from '@/plugins/axios';
import { IComment } from '#/responseResult';
import { Query } from '#/requestParams';

export const createComment = (dto: IComment) => {
  return http.request<IComment>({
    method: 'POST',
    url: 'comments',
    data: dto
  });
};
export const getComments = (query?: Query) => {
  return http.request<IComment[]>({
    url: 'comments',
    params: {
      query
    }
  });
};
