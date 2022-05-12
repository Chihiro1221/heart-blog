import { defineRule, configure } from 'vee-validate'
import { required, max, min, email, numeric, confirmed, digits } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import zh_CN from '@vee-validate/i18n/dist/locale/zh_CN.json'

export default function setupVeeValidate() {
  defineRule('required', required)
  defineRule('max', max)
  defineRule('min', min)
  defineRule('email', email)
  defineRule('number', numeric)
  defineRule('confirmed', confirmed)
  defineRule('digits', digits)
  configure({
    generateMessage: localize('zh_CN', zh_CN),
  })
}
