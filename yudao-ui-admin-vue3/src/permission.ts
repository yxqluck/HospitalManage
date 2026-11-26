import router from './router'
import { getAccessToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

// 路由不重定向白名单
const whiteList = ['/login']

// 路由加载前：本地 token 校验 + 用户信息 / 静态菜单初始化
router.beforeEach(async (to, _from, next) => {
  start()
  loadStart()

  if (!getAccessToken()) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    return
  }

  if (to.path === '/login') {
    next({ path: '/' })
    return
  }

  const userStore = useUserStoreWithOut()
  if (!userStore.getIsSetUser) {
    await userStore.getInfo()
  }
  const permissionStore = usePermissionStoreWithOut()
  if (!permissionStore.getRouters.length) {
    permissionStore.generateRoutes()
  }
  next()
})

router.afterEach((to, _from, failure) => {
  if (!failure) {
    useTitle((to.meta.title as string) || '')
  }
  done()
  loadDone()
})

router.onError(() => {
  done()
  loadDone()
})