import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type {
  AdmissionReq,
  ChangeBedReq,
  HospitalPage,
  LedgerReq,
  RecordDetailVO,
  RecordInhVO,
  RecordPageReq
} from '../types'

/**
 * 住院记录 / 入院 / 出院 / 换床 API
 * 后端接口约定（Base Path：/hospital/record-inh）：
 *  - GET  /hospital/record-inh/page            分页查询住院记录，参数 RecordPageReq
 *  - GET  /hospital/record-inh/get?id=         住院详情（含本次住院期间的治疗记录）
 *  - POST /hospital/record-inh/admission       入院登记，参数 AdmissionReq
 *                                              成功后：床位状态改为占用、病人当前病房同步
 *  - PUT  /hospital/record-inh/discharge       出院办理，参数 { id, outTime }
 *                                              成功后：床位释放为空闲、病人当前病房清空
 *  - PUT  /hospital/record-inh/change-bed      换床，参数 ChangeBedReq
 *  - GET  /hospital/record-inh/in-hospital-list 在院病人一览
 *  - GET  /hospital/record-inh/ledger          住院台账，参数 LedgerReq
 *
 * 注意：住院记录属于历史数据，不提供物理删除接口。
 */

/** 分页查询住院记录 */
export const getRecordPage = (params: RecordPageReq): Promise<HospitalPage<RecordInhVO>> =>
  hospitalApi(
    () => mock.getRecordPage(params),
    () => request.get<HospitalPage<RecordInhVO>>({ url: '/hospital/record-inh/page', params })
  )

/** 住院详情 */
export const getRecord = (inhId: number): Promise<RecordDetailVO> =>
  hospitalApi(
    () => mock.getRecord(inhId),
    () => request.get<RecordDetailVO>({ url: '/hospital/record-inh/get', params: { id: inhId } })
  )

/** 入院登记 */
export const createRecord = (data: AdmissionReq): Promise<number> =>
  hospitalApi(
    () => mock.createRecord(data),
    () => request.post<number>({ url: '/hospital/record-inh/admission', data })
  )

/** 出院办理 */
export const dischargeRecord = (inhId: number, outTime: string): Promise<void> =>
  hospitalApi(
    () => mock.dischargeRecord(inhId, outTime),
    () =>
      request.put<void>({ url: '/hospital/record-inh/discharge', data: { id: inhId, outTime } })
  )

/** 换床 */
export const changeRecordBed = (data: ChangeBedReq): Promise<void> =>
  hospitalApi(
    () => mock.changeRecordBed(data),
    () => request.put<void>({ url: '/hospital/record-inh/change-bed', data })
  )

/** 在院病人一览 */
export const getInHospitalList = (): Promise<RecordInhVO[]> =>
  hospitalApi(
    () => mock.getInHospitalList(),
    () => request.get<RecordInhVO[]>({ url: '/hospital/record-inh/in-hospital-list' })
  )

/** 住院台账（不分页，用于统计报表） */
export const getLedger = (params: LedgerReq = {}): Promise<RecordInhVO[]> =>
  hospitalApi(
    () => mock.getLedger(params),
    () => request.get<RecordInhVO[]>({ url: '/hospital/record-inh/ledger', params })
  )