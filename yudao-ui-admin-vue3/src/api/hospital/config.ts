/**
 * 医院管理模块 - 统一请求封装
 *
 * 演示数据（Mock）默认只在开发环境开启，方便后端接口未完成时预览页面效果：
 *  - `pnpm dev`（开发环境）：默认走内置演示数据；
 *  - `pnpm build:*`（生产构建）：默认调用真实后端接口；
 *  - 需要强制开启 / 关闭时，在对应 `.env.*` 中配置 `VITE_HOSPITAL_MOCK=true|false`。
 *
 * 后端接口就绪后，把 `VITE_HOSPITAL_MOCK=false` 写入 `.env.local` 即可，页面代码无需改动。
 */
const mockFlag = import.meta.env.VITE_HOSPITAL_MOCK

export const HOSPITAL_MOCK_ENABLED =
  mockFlag === 'true' ? true : mockFlag === 'false' ? false : import.meta.env.DEV

/**
 * 医院管理接口统一入口
 *
 * @param mockFn 演示数据实现（仅 Mock 开启时调用）
 * @param realFn 真实接口实现（调用 `@/config/axios` 的 request）
 *
 * 说明：真实接口返回结构遵循 yudao 约定 `{ code: 0, data: ... }`，
 * 由 axios 响应拦截器统一取出 `data`，因此 realFn 直接返回业务数据即可。
 */
export const hospitalApi = <T>(mockFn: () => T, realFn: () => Promise<T>): Promise<T> => {
  if (!HOSPITAL_MOCK_ENABLED) {
    return realFn()
  }
  // 模拟一点网络延迟，方便观察 loading、按钮禁用等交互效果
  return new Promise<T>((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(mockFn())
      } catch (error) {
        reject(error)
      }
    }, 120)
  })
}