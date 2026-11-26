/** 医院管理模块 - 页面公共工具方法 */
import dayjs from 'dayjs'

/** 格式化日期时间：2026-11-10 09:20 */
export const formatDateTime = (value?: string | null) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'
}

/** 格式化日期：2026-11-10 */
export const formatDate = (value?: string | null) => {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}

/** 格式化金额 */
export const formatMoney = (value?: number | null) => {
  return `¥ ${Number(value ?? 0).toFixed(2)}`
}

/** 当前时间，格式：YYYY-MM-DD HH:mm:ss */
export const nowDateTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss')

/** 最近 N 天日期范围，返回 [开始日期, 结束日期]，格式 YYYY-MM-DD */
export const getLastDaysRange = (days = 30): [string, string] => {
  const end = dayjs()
  return [
    end.subtract(Math.max(1, days) - 1, 'day').format('YYYY-MM-DD'),
    end.format('YYYY-MM-DD')
  ]
}

/** 计算住院天数（含首尾两天，未出院时按当前时间计算） */
export const calcInpatientDays = (inTime?: string | null, outTime?: string | null) => {
  if (!inTime) return 0
  const end = outTime ? dayjs(outTime) : dayjs()
  return Math.max(1, end.startOf('day').diff(dayjs(inTime).startOf('day'), 'day') + 1)
}

/** 从异常中取出可展示的错误信息（Mock 会抛出业务校验错误，真实接口由 axios 拦截器提示） */
export const getErrorMessage = (error: unknown, fallback = '操作失败') => {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  return fallback
}