import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import remainingRouter from './modules/remaining'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH), // createWebHashHistory URL带#，createWebHistory URL不带#
  strict: true,
  routes: remainingRouter as RouteRecordRaw[],
  scrollBehavior: () => {
    // 新开标签时、返回标签时，滚动条回到顶部，否则会保留上次标签的滚动位置。
    const scrollbarWrap = document.querySelector('.v-layout-content-scrollbar .el-scrollbar__wrap')
    if (scrollbarWrap) {
      scrollbarWrap.scrollTop = 0
    }
    return { left: 0, top: 0 }
  }
})

// 处理动态导入失败（如重新构建后 chunk 哈希变化），自动跳转到目标页面
router.onError((error, to) => {
  const message = error?.message
  if (typeof message !== 'string') return
  if (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed')
  ) {
    window.location.assign(to.fullPath)
  }
})

// 创建路由实例时注册的全部静态路由名
const staticRouteNames = new Set(router.getRoutes().map((route) => route.name))

// 是否为静态路由名
export const isStaticRouteName = (name: string | symbol): boolean => staticRouteNames.has(name)

// 重置为初始静态路由表
export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !staticRouteNames.has(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router