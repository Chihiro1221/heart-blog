import http from '@/plugins/axios';

export const uploadImage = (file: FormData) => {
  return http.request<any>({
    url: '/upload',
    method: 'post',
    data: file,
  });
};
