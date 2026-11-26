import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type { BedListReq, BedPageReq, BedVO, HospitalPage } from '../types'

/**
 * 病床管理 API
 * 后端接口约定（Base Path：/hospital/bed）：
 *  - GET    /hospital/bed/page            分页查询，参数 BedPageReq
 *  - GET    /hospital/bed/list            查询床位列表（下拉框用），参数 BedListReq
 *  - GET    /hospital/bed/get?id=         查询单个床位
 *  - POST   /hospital/bed/create          新增床位（同一病房内床位号不能重复）
 *  - PUT    /hospital/bed/update          修改床位
 *  - DELETE /hospital/bed/delete?id=      删除床位（占用中不允许删除）
 *  - PUT    /hospital/bed/update-status   修改床位状态，参数 { id, bedStatus }
 */

/** 分页查询床位 */
export const getBedPage = (params: BedPageReq): Promise<HospitalPage<BedVO>> =>
  hospitalApi(
    () => mock.getBedPage(params),
    () => request.get<HospitalPage<BedVO>>({ url: '/hospital/bed/page', params })
  )

/** 查询床位列表（可按病房、状态过滤） */
export const getBedList = (params: BedListReq = {}): Promise<BedVO[]> =>
  hospitalApi(
    () => mock.getBedList(params),
    () => request.get<BedVO[]>({ url: '/hospital/bed/list', params })
  )

/** 查询单个床位 */
export const getBed = (bedId: number): Promise<BedVO> =>
  hospitalApi(
    () => mock.getBed(bedId),
    () => request.get<BedVO>({ url: '/hospital/bed/get', params: { id: bedId } })
  )

/** 新增床位 */
export const createBed = (data: BedVO): Promise<void> =>
  hospitalApi(
    () => mock.createBed(data),
    () => request.post<void>({ url: '/hospital/bed/create', data })
  )

/** 修改床位 */
export const updateBed = (data: BedVO): Promise<void> =>
  hospitalApi(
    () => mock.updateBed(data),
    () => request.put<void>({ url: '/hospital/bed/update', data })
  )

/** 删除床位 */
export const deleteBed = (bedId: number): Promise<void> =>
  hospitalApi(
    () => mock.deleteBed(bedId),
    () => request.delete<void>({ url: '/hospital/bed/delete', params: { id: bedId } })
  )

/** 修改床位状态：0 空闲，1 占用（仅系统流程），2 维修停用 */
export const updateBedStatus = (bedId: number, bedStatus: number): Promise<void> =>
  hospitalApi(
    () => mock.updateBedStatus(bedId, bedStatus),
    () =>
      request.put<void>({
        url: '/hospital/bed/update-status',
        data: { id: bedId, bedStatus }
      })
  )