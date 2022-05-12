import { IUser } from '#/responseResult'
import { getProfile } from '@/apis/login'
import { cacheEnum } from '@/enum/cacheEnum'
import utils from '@/utils'

export default new (class {
  public userProfile = ref<IUser | null>()
  public isLogin = ref<boolean>(false)
  constructor() {}

  public async setUserProfile() {
    const { result } = (await getProfile()) || {}
    this.userProfile.value = result
    this.isLogin.value = true
  }

  // 退出登录
  public logout() {
    this.isLogin.value = false
    this.userProfile.value = null
    utils.store.remove(cacheEnum.TOKEN)
  }
})()
