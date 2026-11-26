/**
 * 医院管理模块 - 页面公共常量
 *
 * 说明：项目自带的字典接口（/system/dict-data）依赖后端字典表，
 * 医院模块暂未配置字典，因此这里使用前端常量，后续可平滑替换为 dict-tag。
 */

export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/** 科室 */
export const DEPT_OPTIONS = [
  '内科',
  '外科',
  '骨科',
  '儿科',
  '妇产科',
  '急诊科',
  'ICU'
].map((item) => ({ label: item, value: item }))

/** 性别：1 男，0 女 */
export const GENDER_OPTIONS = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

export const genderLabel = (gender?: number) => (gender === 1 ? '男' : '女')

/** 病房状态：0 启用，1 禁用 */
export const ROOM_STATUS_OPTIONS = [
  { label: '启用', value: 0 },
  { label: '禁用', value: 1 }
]

export const ROOM_STATUS_CONFIG: Record<number, { label: string; type: TagType }> = {
  0: { label: '启用', type: 'success' },
  1: { label: '禁用', type: 'info' }
}

/** 床位状态：0 空闲，1 占用，2 维修停用 */
export const BED_STATUS_FREE = 0
export const BED_STATUS_OCCUPIED = 1
export const BED_STATUS_REPAIR = 2

export const BED_STATUS_OPTIONS = [
  { label: '空闲', value: BED_STATUS_FREE },
  { label: '占用', value: BED_STATUS_OCCUPIED },
  { label: '维修停用', value: BED_STATUS_REPAIR }
]

export const BED_STATUS_CONFIG: Record<number, { label: string; type: TagType }> = {
  0: { label: '空闲', type: 'success' },
  1: { label: '占用', type: 'warning' },
  2: { label: '维修停用', type: 'info' }
}

/** 医生状态：0 在岗，1 停用 */
export const DOCTOR_STATUS_OPTIONS = [
  { label: '在岗', value: 0 },
  { label: '停用', value: 1 }
]

export const DOCTOR_STATUS_CONFIG: Record<number, { label: string; type: TagType }> = {
  0: { label: '在岗', type: 'success' },
  1: { label: '停用', type: 'info' }
}

/** 医生职称 */
export const TITLE_OPTIONS = [
  '主任医师',
  '副主任医师',
  '主治医师',
  '住院医师',
  '实习医师'
].map((item) => ({ label: item, value: item }))