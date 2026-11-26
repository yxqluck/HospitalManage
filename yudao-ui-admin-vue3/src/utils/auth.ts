import { useCache, CACHE_KEY } from '@/hooks/web/useCache'

const { wsCache } = useCache()

const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'

/** 获取 token */
export const getAccessToken = (): string => {
  return wsCache.get(AccessTokenKey) || ''
}

/** 刷新 token（本地登录模式下不使用，保留给后续接入后端鉴权） */
export const getRefreshToken = (): string => {
  return wsCache.get(RefreshTokenKey) || ''
}

/** 设置 token：本地登录传字符串，接入后端后可传 { accessToken, refreshToken } */
export const setToken = (token: string | { accessToken: string; refreshToken?: string }) => {
  if (typeof token === 'string') {
    wsCache.set(AccessTokenKey, token)
    return
  }
  if (token.refreshToken) wsCache.set(RefreshTokenKey, token.refreshToken)
  wsCache.set(AccessTokenKey, token.accessToken)
}

/** 删除 token */
export const removeToken = () => {
  wsCache.delete(AccessTokenKey)
  wsCache.delete(RefreshTokenKey)
}

/** 格式化 token（jwt 格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token
}

/** 获取当前登录用户编号 */
export const getCurrentUserId = (): number => {
  const user = wsCache.get(CACHE_KEY.USER)?.user
  return user?.id || 0
}

// ========== 租户（本地登录模式下不使用，保留给 axios 拦截器） ==========

export const getTenantId = (): number | undefined => {
  return wsCache.get('TENANT_ID') || undefined
}

export const getVisitTenantId = (): number | undefined => {
  return wsCache.get('VISIT_TENANT_ID') || undefined
}