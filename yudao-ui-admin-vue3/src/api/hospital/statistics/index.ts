import request from '@/config/axios'
import { hospitalApi } from '../config'
import * as mock from '../mock'
import type { BedUsageVO, DoctorWorkloadVO, HospitalOverviewVO } from '../types'

/**
 * 统计报表 API
 * 后端接口约定（Base Path：/hospital/statistics）：
 *  - GET /hospital/statistics/overview                 概览指标
 *  - GET /hospital/statistics/bed-usage                床位使用统计（按病房）
 *  - GET /hospital/statistics/doctor-workload          医生工作量统计，参数 { beginTime, endTime }
 *
 * 在院病人一览、住院台账复用 /hospital/record-inh 下的接口。
 */

/** 概览指标 */
export const getOverview = (): Promise<HospitalOverviewVO> =>
  hospitalApi(
    () => mock.getOverview(),
    () => request.get<HospitalOverviewVO>({ url: '/hospital/statistics/overview' })
  )

/** 床位使用统计 */
export const getBedUsage = (): Promise<BedUsageVO[]> =>
  hospitalApi(
    () => mock.getBedUsage(),
    () => request.get<BedUsageVO[]>({ url: '/hospital/statistics/bed-usage' })
  )

/** 医生工作量统计 */
export const getDoctorWorkload = (beginTime?: string, endTime?: string): Promise<DoctorWorkloadVO[]> =>
  hospitalApi(
    () => mock.getDoctorWorkload(beginTime, endTime),
    () =>
      request.get<DoctorWorkloadVO[]>({
        url: '/hospital/statistics/doctor-workload',
        params: { beginTime, endTime }
      })
  )