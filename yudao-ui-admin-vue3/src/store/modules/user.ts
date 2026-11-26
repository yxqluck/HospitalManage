import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { usePermissionStoreWithOut } from './permission'
// 与 tagsView 互相引用：双方只在 action 运行时取对方 store，模块加载阶段不访问，循环引用安全
import { useTagsViewStoreWithOut } from './tagsView'

/** 本地登录账号（如需修改，改这里即可；后续接入后端鉴权时替换 login 方法） */
export const LOCAL_LOGIN_USERNAME = 'admin'
export const LOCAL_LOGIN_PASSWORD = '123456'

/** 本地演示用的 token，仅用于标记“已登录”，不会发给业务后端校验 */
const LOCAL_TOKEN = 'hospital-local-token'

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface UserInfoVO {
  permissions: Set<string>
  roles: string[]
  isSetUser: boolean
  user: UserVO
}

const defaultUser = (): UserVO => ({
  id: 1,
  avatar: '',
  nickname: '管理员',
  deptId: 0
})

/**
 * 用户状态
 *
 * 本项目去掉了 yudao 的登录接口与权限体系，采用本地账号登录：
 * - 账号密码正确后写入本地 token 与用户信息；
 * - 刷新页面时根据 token 恢复默认用户，不会请求后端。
 */
export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: new Set<string>(),
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    }
  }),
  getters: {
    getPermissions(): Set<string> {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    /** 本地登录 */
    async login(username: string, password: string) {
      if (username.trim() !== LOCAL_LOGIN_USERNAME || password !== LOCAL_LOGIN_PASSWORD) {
        throw new Error('账号或密码错误')
      }
      setToken(LOCAL_TOKEN)
      this.user = defaultUser()
      this.roles = ['admin']
      this.permissions = new Set(['*:*:*'])
      this.isSetUser = true
    },
    /** 刷新页面后恢复用户信息（不再请求后端） */
    async getInfo() {
      if (!getAccessToken()) {
        this.resetState()
        return
      }
      if (!this.isSetUser) {
        this.user = defaultUser()
        this.roles = ['admin']
        this.permissions = new Set(['*:*:*'])
        this.isSetUser = true
      }
    },
    /** 退出登录 */
    async loginOut() {
      this.clearSession()
    },
    /** 清理本地会话 */
    clearSession() {
      removeToken()
      this.resetState()
      useTagsViewStoreWithOut().delAllViews()
      usePermissionStoreWithOut().$reset()
      resetRouter()
    },
    resetState() {
      this.permissions = new Set<string>()
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}