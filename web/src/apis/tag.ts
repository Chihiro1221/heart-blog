import { ITag, ListResult } from '#/responseResult';
import http from '@/plugins/axios';

export const fetchTags = () => {
  return http.request<ListResult<ITag[]>>({
    url: 'tags',
  });
};

export const fetchTag = (id: string) => {
  return http.request<ITag>({
    url: `tags/${id}`,
  });
};
