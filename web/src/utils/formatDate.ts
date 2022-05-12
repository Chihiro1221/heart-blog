import dayjs from "dayjs"

/**
 * 若是发布时间大于7天，就返回准确格式时间，否则返回 *天前
 * @returns date
 */
export default function formatDate(date: string) {
  const temp = dayjs(new Date())
  const difference = temp.diff(date, "d")
  return difference > 7 ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : `${dayjs(date).toNow(true)}前`
}
