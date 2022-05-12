import { defineRule, useField, useForm, configure } from 'vee-validate'
import { required, max, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import zh_CN from '@vee-validate/i18n/dist/locale/zh_CN.json'

export default function setupVeeValidate() {
  defineRule('required', required)
  defineRule('max', max)
  defineRule('min', min)
  configure({
    generateMessage: localize('zh_CN', zh_CN),
  })
}
