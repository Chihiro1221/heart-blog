import { Query } from '#/requestParams';
import { IArticle, ListResult } from '#/responseResult';
import { Status } from '@/enum/statusEnum';
import http from '@/plugins/axios';

export interface CreateArticle {
  title: string;
  cover?: string;
  category?: string | null;
  tags?: string[];
  content: string;
  status?: Status;
}

export const fetchArticles = (query?: Query) => {
  return http.request<ListResult<IArticle[]>>({
    url: 'articles',
    params: {
      query
    }
  });
};

export const fetchArticle = (id: string, query?: Query) => {
  return http.request<IArticle>({
    url: `articles/${id}`,
    params: {
      query
    }
  });
};

export const createArticle = (data: CreateArticle) => {
  return http.request<IArticle>({
    url: 'articles',
    method: 'POST',
    data
  });
};

export const updateArticle = (id: string, data: IArticle) => {
  return http.request<IArticle>({
    url: `articles/${id}`,
    method: 'PUT',
    data
  });
};

export const recycleArticle = (id: string) => {
  return http.request({
    url: `articles/${id}`,
    method: 'DELETE'
  });
};

export const moveRecycleArticle = (id: string) => {
  return http.request({
    url: `articles/move_recycle/${id}`,
    method: 'PUT'
  });
};

export const confirmDeleteArticle = (id: string) => {
  return http.request({
    url: `articles/confirm_delete/${id}`,
    method: 'DELETE'
  });
};

export const confirmDeleteManyArticle = (dto: string[]) => {
  return http.request({
    url: 'articles/confirm_delete_many',
    method: 'DELETE',
    data: dto
  });
};
