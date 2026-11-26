import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type {
  HospitalPage,
  PatientDetailVO,
  PatientPageReq,
  PatientVO
} from '../types'

/**
 * 病人档案 API
 * 后端接口约定（Base Path：/hospital/patient）：
 *  - GET    /hospital/patient/page            分页查询，参数 PatientPageReq
 *  - GET    /hospital/patient/list            查询病人列表（下拉框用）
 *  - GET    /hospital/patient/get?id=         查询单个病人
 *  - GET    /hospital/patient/detail?id=      病人档案详情（历史住院记录 + 全部治疗记录）
 *  - POST   /hospital/patient/create          新建档案（病案号唯一）
 *  - PUT    /hospital/patient/update          修改档案
 *  - DELETE /hospital/patient/delete?id=      删除档案（有住院 / 治疗记录时禁止物理删除）
 */

/** 分页查询病人档案 */
export const getPatientPage = (params: PatientPageReq): Promise<HospitalPage<PatientVO>> =>
  hospitalApi(
    () => mock.getPatientPage(params),
    () => request.get<HospitalPage<PatientVO>>({ url: '/hospital/patient/page', params })
  )

/** 查询病人列表（下拉框） */
export const getPatientList = (): Promise<PatientVO[]> =>
  hospitalApi(
    () => mock.getPatientList(),
    () => request.get<PatientVO[]>({ url: '/hospital/patient/list' })
  )

/** 查询单个病人 */
export const getPatient = (patientId: number): Promise<PatientVO> =>
  hospitalApi(
    () => mock.getPatient(patientId),
    () => request.get<PatientVO>({ url: '/hospital/patient/get', params: { id: patientId } })
  )

/** 病人档案详情：档案 + 全部历史住院记录 + 全部治疗记录 */
export const getPatientDetail = (patientId: number): Promise<PatientDetailVO> =>
  hospitalApi(
    () => mock.getPatientDetail(patientId),
    () => request.get<PatientDetailVO>({ url: '/hospital/patient/detail', params: { id: patientId } })
  )

/** 新建病人档案 */
export const createPatient = (data: PatientVO): Promise<void> =>
  hospitalApi(
    () => mock.createPatient(data),
    () => request.post<void>({ url: '/hospital/patient/create', data })
  )

/** 修改病人档案 */
export const updatePatient = (data: PatientVO): Promise<void> =>
  hospitalApi(
    () => mock.updatePatient(data),
    () => request.put<void>({ url: '/hospital/patient/update', data })
  )

/** 删除病人档案 */
export const deletePatient = (patientId: number): Promise<void> =>
  hospitalApi(
    () => mock.deletePatient(patientId),
    () => request.delete<void>({ url: '/hospital/patient/delete', params: { id: patientId } })
  )