# 医院管理系统前端

基于 [yudao-ui-admin-vue3](https://github.com/yudaocode/yudao-ui-admin-vue3) 精简而来的**独立前端项目**，只保留医院管理模块，不依赖 yudao 的登录、权限、菜单、租户等后端能力。

## 功能模块

| 模块 | 路由 | 说明 |
| --- | --- | --- |
| 病房管理 | `/hospital/room` | 增删改查、启用/禁用、病房床位与在住病人 |
| 病床管理 | `/hospital/bed` | 增删改查、维修停用、占用状态自动维护 |
| 病人档案 | `/hospital/patient` | 建档、编辑、删除、住院与治疗记录 |
| 医生档案 | `/hospital/doctor` | 增删改、停用/启用、工作量 |
| 住院管理 | `/hospital/inpatient` | 入院登记、出院、换床、住院详情 |
| 治疗记录 | `/hospital/treat` | 新增、编辑、按病人/医生/时间查询 |
| 统计报表 | `/hospital/statistics` | 在院病人、床位使用、医生工作量、住院台账 |

## 技术栈

Vue 3 · TypeScript · Vite 8 · Element Plus · Pinia · Vue Router · UnoCSS · Axios

## 快速开始

```bash
pnpm install
pnpm dev
```

- 访问地址：<http://localhost:5173>
- 登录账号：`admin` / `123456`（**本地校验**，不会请求后端）

登录账号在 [`src/store/modules/user.ts`](src/store/modules/user.ts) 中修改，登录页在 [`src/views/Login/index.vue`](src/views/Login/index.vue)。

### 后端接口地址

在 `.env.local` 中配置：

```bash
VITE_BASE_URL='http://localhost:48080'
VITE_API_URL=/admin-api
```

## 与 yudao 原项目的差异

- 删除全部无关业务模块及其 API、组件、路由：系统管理、基础设施、工作流、商城、CRM、ERP、MES、IoT、OA、HRM、支付、报表等。
- 移除**后端动态菜单**与**角色权限**：所有路由静态注册在 [`src/router/modules/remaining.ts`](src/router/modules/remaining.ts)，登录后直接显示「医院管理」菜单。
- 移除租户、验证码、社交登录、消息中心、锁屏、个人中心、IM 等能力。
- 清理与运行无关的文件：Docker/CI 配置、ESLint/Prettier/Stylelint 配置、提交规范与 git hooks、演示截图、演示音频/图片、多余的环境文件。
- 依赖从 68 个精简到 20 个，`package.json` 只保留运行/构建所需内容。

新增页面：

1. 在 `src/views/` 下创建页面；
2. 在 `src/router/modules/remaining.ts` 中加一条路由；
3. 侧边栏菜单会自动出现（`meta.title`、`meta.icon`），无需改其他地方。

## 目录结构

```
yudao-ui-admin-vue3/
├── build/vite/             Vite 插件配置（构建必需）
├── public/favicon.ico      站点图标
├── src/
│   ├── api/hospital/       医院模块接口（含内置演示数据）
│   ├── views/hospital/     医院模块页面
│   ├── views/Login/        本地登录页
│   ├── views/Error/        403 / 404 / 500
│   ├── layout/             布局外壳（侧边栏、顶栏、标签页、设置）
│   ├── router/             静态路由
│   ├── store/              app / user / permission / tagsView / locale
│   ├── components/         Icon、ContentWrap、Dialog、Pagination、RouterSearch
│   ├── hooks/ · utils/ · styles/ · locales/
│   └── permission.ts       登录校验与菜单初始化
├── types/                  TS 全局声明
├── .env / .env.local / .env.prod
├── index.html
├── package.json · pnpm-lock.yaml · pnpm-workspace.yaml
├── tsconfig.json · uno.config.ts · vite.config.ts
└── README.md
```

## 接口与演示数据

- 接口清单、字段说明、后端返回结构约定见 [`src/views/hospital/README.md`](src/views/hospital/README.md)。
- 演示数据默认**开发环境开启**，可直接操作所有页面；在 `.env.local` 写入 `VITE_HOSPITAL_MOCK=false` 即改为请求真实接口。
- axios 按 `{ code, data, msg }` 解析；如果后端返回裸 JSON，需要在 `src/config/axios/service.ts` 中放行。

## 命令

```bash
pnpm dev           # 本地开发（5173）
pnpm ts:check      # 类型检查
pnpm build:local   # 本地构建，输出 dist/
pnpm build:prod    # 生产构建，输出 dist-prod/
pnpm preview       # 构建并预览
```

> 项目未内置 ESLint / Prettier / Stylelint / 提交钩子，如需代码规范检查可自行安装配置。

## 已验证

- `pnpm ts:check`：0 错误
- `pnpm build:local`：构建成功
- 开发模式页面与组件编译：全部通过