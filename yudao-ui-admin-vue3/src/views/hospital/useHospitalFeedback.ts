import { HOSPITAL_MOCK_ENABLED } from '@/api/hospital/config'
import { getErrorMessage } from './utils'

/**
 * 医院管理模块 - 交互辅助
 *
 * 1. Mock 模式下没有 axios 响应拦截器兜底，业务校验错误需要手动提示；
 * 2. 真实接口由拦截器统一提示错误，这里不再重复弹窗；
 * 3. confirm 封装用于处理用户点击“取消”时不误报错误。
 */
export const useHospitalFeedback = () => {
  const message = useMessage()

  /** 操作失败提示（仅 Mock 模式） */
  const reportError = (error: unknown, fallback?: string) => {
    if (HOSPITAL_MOCK_ENABLED) {
      message.error(getErrorMessage(error, fallback))
    }
  }

  /** 二次确认，返回 true 表示用户确认 */
  const confirm = async (content: string, tip?: string) => {
    try {
      await message.confirm(content, tip)
      return true
    } catch {
      return false
    }
  }

  /** 删除确认，返回 true 表示用户确认 */
  const delConfirm = async (content: string, tip?: string) => {
    try {
      await message.delConfirm(content, tip)
      return true
    } catch {
      return false
    }
  }

  return { message, reportError, confirm, delConfirm }
}