import { defineStore } from 'pinia';
import { getProfile } from '@/apis/login';
import { IUser } from '#/responseResult';
import utils from '@/utils';
import { cacheEnum } from '@/enum/cacheEnum';

export const userStore = defineStore('user', {
  state: () => ({
    profile: {} as IUser | null,
    isLogin: false
  }),
  actions: {
    async getUserProfile() {
      const { result } = (await getProfile()) || {};
      if (result) {
        this.profile = result;
        this.isLogin = true;
      }
    },
    logout() {
      this.isLogin = false;
      this.profile = null;
      utils.store.remove(cacheEnum.TOKEN);
    }
  }
});
