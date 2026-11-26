import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type {
  HospitalPage,
  RoomDetailVO,
  RoomPageReq,
  RoomVO
} from '../types'

/**
 * 病房管理 API
 * 后端接口约定（Base Path：/hospital/room）：
 *  - GET    /hospital/room/page            分页查询，参数 RoomPageReq
 *  - GET    /hospital/room/list            查询全部病房（下拉框用）
 *  - GET    /hospital/room/get?id=         查询单个病房
 *  - GET    /hospital/room/detail?id=      病房详情（含床位、在住病人）
 *  - POST   /hospital/room/create          新增病房
 *  - PUT    /hospital/room/update          修改病房
 *  - DELETE /hospital/room/delete?id=      删除病房
 *  - PUT    /hospital/room/update-status   启用 / 禁用病房，参数 { id, status }
 */

/** 分页查询病房 */
export const getRoomPage = (params: RoomPageReq): Promise<HospitalPage<RoomVO>> =>
  hospitalApi(
    () => mock.getRoomPage(params),
    () => request.get<HospitalPage<RoomVO>>({ url: '/hospital/room/page', params })
  )

/** 查询全部病房（下拉框） */
export const getRoomList = (): Promise<RoomVO[]> =>
  hospitalApi(
    () => mock.getRoomList(),
    () => request.get<RoomVO[]>({ url: '/hospital/room/list' })
  )

/** 查询单个病房 */
export const getRoom = (roomId: number): Promise<RoomVO> =>
  hospitalApi(
    () => mock.getRoom(roomId),
    () => request.get<RoomVO>({ url: '/hospital/room/get', params: { id: roomId } })
  )

/** 病房详情：病房 + 该病房下全部床位（含在住病人） */
export const getRoomDetail = (roomId: number): Promise<RoomDetailVO> =>
  hospitalApi(
    () => mock.getRoomDetail(roomId),
    () => request.get<RoomDetailVO>({ url: '/hospital/room/detail', params: { id: roomId } })
  )

/** 新增病房 */
export const createRoom = (data: RoomVO): Promise<void> =>
  hospitalApi(
    () => mock.createRoom(data),
    () => request.post<void>({ url: '/hospital/room/create', data })
  )

/** 修改病房 */
export const updateRoom = (data: RoomVO): Promise<void> =>
  hospitalApi(
    () => mock.updateRoom(data),
    () => request.put<void>({ url: '/hospital/room/update', data })
  )

/** 删除病房 */
export const deleteRoom = (roomId: number): Promise<void> =>
  hospitalApi(
    () => mock.deleteRoom(roomId),
    () => request.delete<void>({ url: '/hospital/room/delete', params: { id: roomId } })
  )

/** 启用 / 禁用病房 */
export const updateRoomStatus = (roomId: number, status: number): Promise<void> =>
  hospitalApi(
    () => mock.updateRoomStatus(roomId, status),
    () =>
      request.put<void>({ url: '/hospital/room/update-status', data: { id: roomId, status } })
  )