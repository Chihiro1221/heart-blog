import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import isLeapYear from "dayjs/plugin/isLeapYear"
import "dayjs/locale/zh-cn" // import locale

export default function setupDayjsPlugins() {
  dayjs.extend(relativeTime)
  dayjs.extend(isLeapYear as any) // use plugin
  dayjs.locale("zh-cn") // use locale
}
