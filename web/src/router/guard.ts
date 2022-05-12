import { RouteLocationNormalized } from 'vue-router';
import router from '@/router';
import { Router } from 'vue-router';
import { userStore } from '@/store/user';
import utils from '@/utils';
import { cacheEnum } from '@/enum/cacheEnum';

export default class Guard {
  public router: Router = router;

  constructor() {
    this.init();
  }

  private init() {
    this.router.beforeEach(this.beforeEach.bind(this));
  }

  private token() {
    return utils.store.get(cacheEnum.TOKEN)?.cache.token;
  }

  private beforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) {
    if (!this.isGuest(to)) return from;
    if (!this.isAuthorized(to)) return from;
    if (this.token()) userStore().getUserProfile();
  }

  // 检测是否是游客
  private isGuest(to: RouteLocationNormalized) {
    return to.meta.guest ? !this.token() : true;
  }

  // 检测是否需要授权
  private isAuthorized(to: RouteLocationNormalized) {
    if (!to.meta.isAuth) return true;
    return !!this.token();
  }
}
