import { utils } from '@/utils'
import router from '@/router'
import { cacheEnum } from '@/enum/cacheEnum'
import { message } from 'ant-design-vue'

export default class Auth {
  public logout() {
    utils.store.remove(cacheEnum.TOKEN)
    router.push('/login')
    message.success('已退出!')
  }
}
