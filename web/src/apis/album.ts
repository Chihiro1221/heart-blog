import { Query } from "#/requestParams";
import { IAlbum, ListResult } from "#/responseResult";
import http from "@/plugins/axios";

export const fetchAlbum = (query?: Query) => {
  return http.request<ListResult<IAlbum[]>>({
    url: "album",
    params: { query },
  });
};

export const fetchAlbumById = (id: string, query?: Query) => {
  return http.request<IAlbum>({
    url: `album/${id}`,
    params: { query },
  });
};
