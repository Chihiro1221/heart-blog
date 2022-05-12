import { ResponseResult } from '#/responseResult';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import utils from '@/utils';
import { cacheEnum } from '@/enum/cacheEnum';

export default class Axios {
  private instance: AxiosInstance;
  public config: AxiosRequestConfig;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.config = config;
    this.setupInterceptors();
  }

  public async request<T, R = ResponseResult<T>>(config: AxiosRequestConfig) {
    return (await this.instance.request<R>(config))?.data;
  }

  private setupInterceptors() {
    this.requestInterceptor();
    this.responseInterceptor();
  }

  private requestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        Axios.setAuthorizationHeader(config);
        NProgress.start();
        return config;
      },
      (err) => {
        Promise.reject(err);
      }
    );
  }

  private static setAuthorizationHeader(config: AxiosRequestConfig) {
    const token = utils.store.get(cacheEnum.TOKEN)?.cache?.token;
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
  }

  private responseInterceptor() {
    this.instance.interceptors.response.use(
      (config) => {
        NProgress.done();
        return config;
      },
      (err) => {
        const result = err.response?.data;
        if (result?.error === 'UnauthorizedException') {
          utils.store.remove(cacheEnum.TOKEN);
          return ElMessage({
            message: '请先登录',
            type: 'error',
          });
        }
        ElMessage({
          message: result?.message,
          type: 'error',
        });
        void Promise.reject(err);
      }
    );
  }
}
