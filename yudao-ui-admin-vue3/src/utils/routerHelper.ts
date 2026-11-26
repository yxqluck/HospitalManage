import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import { isUrl } from '@/utils/is'

/* Layout */
export const Layout = () => import('@/layout/Layout.vue')

// 嵌套目录只透传子路由，不能再次渲染完整 Layout
const ParentLayout = defineComponent({
  name: 'ParentLayout',
  setup() {
    return () => h(RouterView)
  }
})

export const getParentLayout = () => ParentLayout

/**
 * 去掉匹配到的路由记录，只保留可序列化的部分（用于标签页缓存）
 */
export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

/**
 * 拼接父路径与子路径：
 * - 外链原样返回
 * - 子路径以 / 开头时按绝对路径处理
 * - 空路径返回父路径
 */
export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  if (!path) return parentPath
  if (path.startsWith('/')) return path.replace(/\/+/g, '/')
  return `${parentPath}/${path}`.replace(/\/+/g, '/')
}