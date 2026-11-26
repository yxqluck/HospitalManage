import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type {
  DoctorDetailVO,
  DoctorPageReq,
  DoctorVO,
  HospitalPage
} from '../types'

/**
 * 医生档案 API
 * 后端接口约定（Base Path：/hospital/doctor）：
 *  - GET    /hospital/doctor/page            分页查询，参数 DoctorPageReq
 *  - GET    /hospital/doctor/list            查询医生列表，参数 { status }（下拉框）
 *  - GET    /hospital/doctor/get?id=         查询单个医生
 *  - GET    /hospital/doctor/detail?id=      医生详情（治疗记录 + 负责过的病人）
 *  - POST   /hospital/doctor/create          新增医生（医生编号唯一）
 *  - PUT    /hospital/doctor/update          修改医生
 *  - DELETE /hospital/doctor/delete?id=      删除医生（有治疗记录时禁止物理删除）
 *  - PUT    /hospital/doctor/update-status   启用 / 停用医生，参数 { id, status }
 */

/** 分页查询医生 */
export const getDoctorPage = (params: DoctorPageReq): Promise<HospitalPage<DoctorVO>> =>
  hospitalApi(
    () => mock.getDoctorPage(params),
    () => request.get<HospitalPage<DoctorVO>>({ url: '/hospital/doctor/page', params })
  )

/** 查询医生列表（下拉框）；status=0 只查在岗医生 */
export const getDoctorList = (status?: number): Promise<DoctorVO[]> =>
  hospitalApi(
    () => mock.getDoctorList(status),
    () => request.get<DoctorVO[]>({ url: '/hospital/doctor/list', params: { status } })
  )

/** 查询单个医生 */
export const getDoctor = (docId: number): Promise<DoctorVO> =>
  hospitalApi(
    () => mock.getDoctor(docId),
    () => request.get<DoctorVO>({ url: '/hospital/doctor/get', params: { id: docId } })
  )

/** 医生详情：医生 + 治疗记录 + 负责过的病人 */
export const getDoctorDetail = (docId: number): Promise<DoctorDetailVO> =>
  hospitalApi(
    () => mock.getDoctorDetail(docId),
    () => request.get<DoctorDetailVO>({ url: '/hospital/doctor/detail', params: { id: docId } })
  )

/** 新增医生 */
export const createDoctor = (data: DoctorVO): Promise<void> =>
  hospitalApi(
    () => mock.createDoctor(data),
    () => request.post<void>({ url: '/hospital/doctor/create', data })
  )

/** 修改医生 */
export const updateDoctor = (data: DoctorVO): Promise<void> =>
  hospitalApi(
    () => mock.updateDoctor(data),
    () => request.put<void>({ url: '/hospital/doctor/update', data })
  )

/** 删除医生 */
export const deleteDoctor = (docId: number): Promise<void> =>
  hospitalApi(
    () => mock.deleteDoctor(docId),
    () => request.delete<void>({ url: '/hospital/doctor/delete', params: { id: docId } })
  )

/** 启用 / 停用医生 */
export const updateDoctorStatus = (docId: number, status: number): Promise<void> =>
  hospitalApi(
    () => mock.updateDoctorStatus(docId, status),
    () =>
      request.put<void>({ url: '/hospital/doctor/update-status', data: { id: docId, status } })
  )