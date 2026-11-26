# 医院管理模块（前端框架）

> 对应需求：`需求分析.docx` 第 1 ~ 4 章（基础档案、住院业务、治疗记录、查询统计）。
> 本目录只负责前端页面与接口调用骨架，**后端接口逻辑由你后续实现**。
>
> 本项目已移除 yudao 的后端权限与动态菜单，全部路由静态注册在 `src/router/modules/remaining.ts`；
> 登录使用本地账号 `admin / 123456`，不依赖后端登录接口。

## 一、目录结构

```
src/api/hospital/                 接口层（含内置演示数据）
├── types.ts                      所有 VO / 查询参数类型（与数据库字段一一对应）
├── config.ts                     hospitalApi 封装 + Mock 开关
├── mock.ts                       内存版“假后端”（增删改查、入院/出院/换床、统计）
├── room/index.ts                 病房接口
├── bed/index.ts                  病床接口
├── patient/index.ts              病人档案接口
├── doctor/index.ts               医生档案接口
├── record-inh/index.ts           住院记录 / 入院 / 出院 / 换床接口
├── record-treat/index.ts         治疗记录接口
└── statistics/index.ts           统计报表接口

src/views/hospital/               页面层
├── constants.ts                  科室、性别、床位状态、职称等前端常量
├── utils.ts                      日期 / 金额 / 住院天数格式化
├── useHospitalFeedback.ts        消息提示、二次确认、Mock 错误提示
├── room/                         病房管理（列表 + 表单 + 详情抽屉）
├── bed/                          病床管理（列表 + 表单）
├── patient/                      病人档案（列表 + 表单 + 档案详情）
├── doctor/                       医生档案（列表 + 表单 + 档案详情）
├── inpatient/                    住院管理（入院登记、出院、换床、详情）
├── treat/                        治疗记录（列表 + 表单）
└── statistics/                   统计报表（4 个页签）
```

菜单入口在 `src/router/modules/remaining.ts` 的 `/hospital` 路由下，登录后左侧菜单会出现「医院管理」分组：

| 菜单 | 路由 | 页面 |
| --- | --- | --- |
| 病房管理 | `/hospital/room` | `views/hospital/room/index.vue` |
| 病床管理 | `/hospital/bed` | `views/hospital/bed/index.vue` |
| 病人档案 | `/hospital/patient` | `views/hospital/patient/index.vue` |
| 医生档案 | `/hospital/doctor` | `views/hospital/doctor/index.vue` |
| 住院管理 | `/hospital/inpatient` | `views/hospital/inpatient/index.vue` |
| 治疗记录 | `/hospital/treat` | `views/hospital/treat/index.vue` |
| 统计报表 | `/hospital/statistics` | `views/hospital/statistics/index.vue` |

## 二、已实现的功能

### 1. 基础档案

- **病房管理**：新增 / 编辑 / 删除；按编号、科室、地点、状态筛选；查看病房下全部床位及在住病人；启用 / 禁用（禁用后不能再分配床位）。
- **病床管理**：新增 / 编辑 / 删除；绑定病房与床位号；状态维护（空闲 / 占用 / 维修停用）；按病房、科室、状态筛选；同一病房内床位号重复校验。
- **病人档案**：建档（病案号手动录入，唯一）、编辑、删除、查询；查看全部历史住院记录 + 全部治疗记录；在院状态展示。
- **医生档案**：新增 / 编辑 / 删除 / 停用；按科室、职称、状态筛选；查看负责过的病人与治疗记录。

### 2. 住院业务

- **入院登记**：选择病人、病房、空闲床位、入院时间；病人不存在 / 已在院 / 床位被占用 / 病房被禁用等校验。
- **出院办理**：填写出院时间（不能早于入院时间），床位自动释放、病人当前病房清空。
- **住院记录查询**：按病案号、姓名、科室、病房、入院日期、状态（在院 / 已出院）筛选；显示住院天数、预计费用、主治医生。
- **换床**：选择新病房与新床位，旧床位释放、新床位占用，住院记录与病人档案同步。
- **住院详情**：病人信息、病房床位、入出院时间、本次住院期间的全部治疗记录。

### 3. 治疗记录

- 新增 / 编辑治疗记录：病人、医生、治疗时间、诊断、治疗方案。
- 按病案号 / 姓名 / 诊断、医生、时间范围查询。
- 病人档案、医生档案、住院详情中均可下钻查看关联治疗记录。

### 4. 统计报表

- **在院病人一览**：科室、病房、床位、病人、入院时间、已住院天数、主治医生、预计费用，顶部 4 个指标卡。
- **床位使用统计**：各病房床位总数、占用、空闲、维修与使用率。
- **医生工作量**：按时间范围统计治疗人次、负责病人数，并做横向对比。
- **住院台账**：按病案号、姓名、入院日期查询全部历史住院记录。

> 住院费用当前按「住院天数 × 病房收费标准」估算，属于需求中的扩展功能。

## 三、前后端交互约定

### 1. 请求封装

页面只调用 `src/api/hospital/**` 中的方法，不直接使用 axios。示例：

```ts
// api/hospital/room/index.ts
export const getRoomPage = (params: RoomPageReq): Promise<HospitalPage<RoomVO>> =>
  hospitalApi(
    () => mock.getRoomPage(params), // Mock 实现
    () => request.get({ url: '/hospital/room/page', params }) // 真实接口
  )
```

`hospitalApi` 见 `api/hospital/config.ts`：开发环境默认走 Mock，生产构建默认请求真实接口；也可用 `VITE_HOSPITAL_MOCK` 强制开关。

### 2. 演示数据开关

演示数据（Mock）默认**只在开发环境开启**：

| 场景 | 是否使用演示数据 |
| --- | --- |
| `pnpm dev`（开发环境） | 是（无需配置） |
| `pnpm build:*`（生产构建） | 否，直接请求真实接口 |

也可以显式覆盖，在 `.env.local` 中配置：

```bash
# true - 强制使用内置演示数据；false - 强制调用真实后端接口
VITE_HOSPITAL_MOCK=false
```

- 演示数据保存在内存中，刷新页面后重置，不会影响真实数据库。
- 后端接口就绪后，在 `.env.local` 写入 `VITE_HOSPITAL_MOCK=false` 即可，页面代码无需修改；确认无误后可删除 `mock.ts` 及 `api/hospital/*/index.ts` 中的 Mock 分支。

### 3. 返回结构

项目使用的 axios 拦截器（`src/config/axios/service.ts`）按 yudao 约定解析响应：

```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

`request.get` 等方法会直接返回 `data` 字段。**当前 Manage 后端返回的是裸 JSON（没有 `code/data` 包装）**，联调时二选一：

1. 后端增加统一返回体 `CommonResult<T>`（推荐，与 yudao 生态一致）；
2. 或在 `service.ts` 中单独放行 `/hospital/**` 的响应，直接把整个响应体当作 `data`。

### 4. 接口清单

所有接口以 `/hospital` 为前缀，分页参数统一为 `pageNo`、`pageSize`，分页返回 `{ list, total }`。

| 模块 | 方法 | 路径 | 说明 |
| --- | --- | --- | --- |
| 病房 | GET | `/hospital/room/page` | 分页查询 |
| 病房 | GET | `/hospital/room/list` | 全部病房（下拉） |
| 病房 | GET | `/hospital/room/get?id=` | 单个病房 |
| 病房 | GET | `/hospital/room/detail?id=` | 病房 + 床位 + 在住病人 |
| 病房 | POST | `/hospital/room/create` | 新增 |
| 病房 | PUT | `/hospital/room/update` | 修改 |
| 病房 | DELETE | `/hospital/room/delete?id=` | 删除 |
| 病房 | PUT | `/hospital/room/update-status` | `{ id, status }` 启用/禁用 |
| 病床 | GET | `/hospital/bed/page` | 分页查询 |
| 病床 | GET | `/hospital/bed/list` | 床位列表（下拉，可按病房/状态过滤） |
| 病床 | GET | `/hospital/bed/get?id=` | 单个床位 |
| 病床 | POST | `/hospital/bed/create` | 新增 |
| 病床 | PUT | `/hospital/bed/update` | 修改 |
| 病床 | DELETE | `/hospital/bed/delete?id=` | 删除 |
| 病床 | PUT | `/hospital/bed/update-status` | `{ id, bedStatus }` |
| 病人 | GET | `/hospital/patient/page` | 分页查询 |
| 病人 | GET | `/hospital/patient/list` | 病人列表（下拉） |
| 病人 | GET | `/hospital/patient/get?id=` | 单个病人 |
| 病人 | GET | `/hospital/patient/detail?id=` | 档案 + 住院 + 治疗记录 |
| 病人 | POST | `/hospital/patient/create` | 建档 |
| 病人 | PUT | `/hospital/patient/update` | 修改 |
| 病人 | DELETE | `/hospital/patient/delete?id=` | 删除 |
| 医生 | GET | `/hospital/doctor/page` | 分页查询 |
| 医生 | GET | `/hospital/doctor/list?status=` | 医生列表（下拉） |
| 医生 | GET | `/hospital/doctor/get?id=` | 单个医生 |
| 医生 | GET | `/hospital/doctor/detail?id=` | 医生 + 治疗 + 负责病人 |
| 医生 | POST | `/hospital/doctor/create` | 新增 |
| 医生 | PUT | `/hospital/doctor/update` | 修改 |
| 医生 | DELETE | `/hospital/doctor/delete?id=` | 删除 |
| 医生 | PUT | `/hospital/doctor/update-status` | `{ id, status }` 停用/启用 |
| 住院 | GET | `/hospital/record-inh/page` | 分页查询 |
| 住院 | GET | `/hospital/record-inh/get?id=` | 住院详情 + 治疗记录 |
| 住院 | POST | `/hospital/record-inh/admission` | 入院登记 |
| 住院 | PUT | `/hospital/record-inh/discharge` | `{ id, outTime }` 出院 |
| 住院 | PUT | `/hospital/record-inh/change-bed` | 换床 |
| 住院 | GET | `/hospital/record-inh/in-hospital-list` | 在院病人一览 |
| 住院 | GET | `/hospital/record-inh/ledger` | 住院台账 |
| 治疗 | GET | `/hospital/record-treat/page` | 分页查询 |
| 治疗 | GET | `/hospital/record-treat/get?id=` | 单条记录 |
| 治疗 | POST | `/hospital/record-treat/create` | 新增 |
| 治疗 | PUT | `/hospital/record-treat/update` | 修改 |
| 统计 | GET | `/hospital/statistics/overview` | 概览指标 |
| 统计 | GET | `/hospital/statistics/bed-usage` | 床位使用统计 |
| 统计 | GET | `/hospital/statistics/doctor-workload` | `beginTime`、`endTime` |

各接口的完整字段见 `src/api/hospital/types.ts`，字段名与 `crebas.sql` 中的列名（驼峰）一致。

## 四、字段与后端注意事项

1. **扩展字段**：需求中的「禁用病房」「停用医生」目前数据库没有对应列，前端约定为：
   - `hospital_room.status`：`0` 启用、`1` 禁用；
   - `hospital_doctor.status`：`0` 在岗、`1` 停用。
   后端需要补这两列（或改为逻辑删除标记），否则这两个按钮需要调整。
2. **派生字段**：`bedCount`、`patientName`、`dept`、`bedNo`、`days`、`fee`、`docName` 等由接口 JOIN 计算后返回（`types.ts` 中已用「派生」标注），不是表字段。
3. **历史数据保护**：住院记录、治疗记录没有提供物理删除；删除病人 / 医生 / 病房 / 床位时，只要有历史数据就会被拒绝，需改为停用（与需求第 5 章一致）。
4. **病案号 / 医生编号 / 病房编号**：均为手工录入的主键，前端已做「必填 + 唯一」校验（后端仍需再校验一次）。
5. **床位状态流转**：`占用` 只能由入院 / 换床产生，由出院 / 换床释放，页面不允许手工改成占用。

## 五、建议后续补充

- **角色权限**：目前为本地单账号登录，所有页面均可见。如需按角色控制，可在 `remaining.ts` 的 `meta` 中加角色标记，并在 `permission.ts` 里过滤。
- **操作日志**：新增入院、出院、新增治疗记录时调用后端日志接口（或在后端切面记录）。
- **并发控制**：同一床位同时办理入院时，后端需在事务中对床位加锁（`SELECT ... FOR UPDATE`）或使用乐观锁，避免重复占用。
- **治疗记录关联住院**：需求中为可选项；当前治疗表没有 `inh_id`，如需区分门诊 / 住院治疗，可在 `hospital_record_treat` 增加 `inh_id` 字段，并在 `TreatForm` 中增加「关联住院记录」下拉。
- **逻辑删除**：如需保留删除能力，可按 yudao 约定增加 `deleted` 字段，并在查询中过滤。