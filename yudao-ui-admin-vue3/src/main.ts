// Element Plus 全量样式：仅 VITE_USE_ALL_ELEMENT_PLUS_STYLE=true 时引入，否则为空模块；需早于项目样式
import 'virtual:element-plus-style'

// 引入unocss css
import 'virtual:uno.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.scss'

// 路由
import router, { setupRouter } from '@/router'

// 指令
import { setupAuth, setupMountedFocus } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患

import print from 'vue3-print-nb' // 打印插件

// 处理 Vite 预加载模块失败（如重新构建后 chunk 哈希变化），自动刷新页面
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  window.location.reload()
})

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  // directives 指令
  setupAuth(app)
  setupMountedFocus(app)

  await router.isReady()

  app.use(VueDOMPurifyHTML)

  // 打印
  app.use(print)

  app.mount('#app')
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
