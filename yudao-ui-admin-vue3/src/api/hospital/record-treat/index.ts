import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type { HospitalPage, RecordTreatVO, TreatPageReq } from '../types'

/**
 * 治疗记录 API（病人 - 医生 多对多）
 * 后端接口约定（Base Path：/hospital/record-treat）：
 *  - GET  /hospital/record-treat/page     分页查询，参数 TreatPageReq
 *  - GET  /hospital/record-treat/get?id=  查询单条治疗记录
 *  - POST /hospital/record-treat/create   新增治疗记录
 *  - PUT  /hospital/record-treat/update   修改治疗记录
 *
 * 注意：治疗记录属于历史数据，不提供物理删除接口。
 */

/** 分页查询治疗记录 */
export const getTreatPage = (params: TreatPageReq): Promise<HospitalPage<RecordTreatVO>> =>
  hospitalApi(
    () => mock.getTreatPage(params),
    () => request.get<HospitalPage<RecordTreatVO>>({ url: '/hospital/record-treat/page', params })
  )

/** 查询单条治疗记录 */
export const getTreat = (treatId: number): Promise<RecordTreatVO> =>
  hospitalApi(
    () => mock.getTreat(treatId),
    () => request.get<RecordTreatVO>({ url: '/hospital/record-treat/get', params: { id: treatId } })
  )

/** 新增治疗记录 */
export const createTreat = (data: RecordTreatVO): Promise<void> =>
  hospitalApi(
    () => mock.createTreat(data),
    () => request.post<void>({ url: '/hospital/record-treat/create', data })
  )

/** 修改治疗记录 */
export const updateTreat = (data: RecordTreatVO): Promise<void> =>
  hospitalApi(
    () => mock.updateTreat(data),
    () => request.put<void>({ url: '/hospital/record-treat/update', data })
  )