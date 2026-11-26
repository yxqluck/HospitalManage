/**
 * 医院管理模块 - 内置演示数据（Mock）
 *
 * 作用：后端接口尚未完成时，让前端页面可以完整地跑起来（查询、分页、新增、编辑、删除、入院、出院、换床等）。
 * 数据保存在内存中，刷新页面后恢复初始状态，不会影响真实数据库。
 *
 * 关闭方式：在 `.env.local` 中配置 `VITE_HOSPITAL_MOCK=false`，所有请求将改为调用真实后端接口。
 *
 * 注意：本文件只是「假后端」，正式联调时可以把这里删除，业务代码无需调整。
 */
import dayjs from 'dayjs'
import type {
  AdmissionReq,
  BedListReq,
  BedPageReq,
  BedUsageVO,
  BedVO,
  ChangeBedReq,
  DoctorDetailVO,
  DoctorPageReq,
  DoctorPatientVO,
  DoctorVO,
  DoctorWorkloadVO,
  HospitalOverviewVO,
  HospitalPage,
  LedgerReq,
  PatientDetailVO,
  PatientPageReq,
  PatientVO,
  RecordDetailVO,
  RecordInhVO,
  RecordPageReq,
  RecordTreatVO,
  RoomDetailVO,
  RoomPageReq,
  RoomVO,
  TreatPageReq
} from './types'

/* ============================ 工具方法 ============================ */

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const NOW = () => dayjs().format('YYYY-MM-DD HH:mm:ss')

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && (value as unknown) !== ''

const includes = (value: unknown, keyword?: string | number) => {
  if (!hasValue(keyword)) return true
  return String(value ?? '').includes(String(keyword).trim())
}

const pageList = <T>(list: T[], pageNo = 1, pageSize = 10): HospitalPage<T> => {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return {
    list: clone(list.slice(start, start + Number(pageSize))),
    total: list.length
  }
}

const nextId = <T>(list: T[], getter: (item: T) => number) =>
  list.reduce((max, item) => Math.max(max, getter(item)), 0) + 1

const calcDays = (inTime: string, outTime?: string | null) => {
  const end = outTime ? dayjs(outTime) : dayjs()
  return Math.max(1, end.startOf('day').diff(dayjs(inTime).startOf('day'), 'day') + 1)
}

const inRange = (time: string, beginTime?: string, endTime?: string) => {
  const value = dayjs(time).valueOf()
  if (beginTime && value < dayjs(beginTime).startOf('day').valueOf()) return false
  if (endTime && value > dayjs(endTime).endOf('day').valueOf()) return false
  return true
}

/* ============================ 内存数据 ============================ */

const rooms: RoomVO[] = [
  { roomId: 1001, dept: '内科', location: '1号楼 3层 301', fee: 120, status: 0 },
  { roomId: 1002, dept: '内科', location: '1号楼 3层 302', fee: 120, status: 0 },
  { roomId: 2001, dept: '外科', location: '2号楼 2层 201', fee: 180, status: 0 },
  { roomId: 2002, dept: '外科', location: '2号楼 2层 202', fee: 180, status: 0 },
  { roomId: 3001, dept: '骨科', location: '2号楼 4层 401', fee: 150, status: 0 },
  { roomId: 4001, dept: '儿科', location: '3号楼 1层 101', fee: 100, status: 0 },
  { roomId: 5001, dept: 'ICU', location: '1号楼 5层 501', fee: 480, status: 0 },
  { roomId: 4002, dept: '儿科', location: '3号楼 1层 102', fee: 100, status: 1 }
]

const beds: BedVO[] = [
  { bedId: 1, roomId: 1001, bedNo: 1, bedStatus: 1 },
  { bedId: 2, roomId: 1001, bedNo: 2, bedStatus: 1 },
  { bedId: 3, roomId: 1001, bedNo: 3, bedStatus: 2 },
  { bedId: 4, roomId: 1001, bedNo: 4, bedStatus: 0 },
  { bedId: 5, roomId: 1002, bedNo: 1, bedStatus: 1 },
  { bedId: 6, roomId: 1002, bedNo: 2, bedStatus: 0 },
  { bedId: 7, roomId: 1002, bedNo: 3, bedStatus: 0 },
  { bedId: 8, roomId: 1002, bedNo: 4, bedStatus: 0 },
  { bedId: 9, roomId: 2001, bedNo: 1, bedStatus: 1 },
  { bedId: 10, roomId: 2001, bedNo: 2, bedStatus: 0 },
  { bedId: 11, roomId: 2001, bedNo: 3, bedStatus: 0 },
  { bedId: 12, roomId: 2001, bedNo: 4, bedStatus: 0 },
  { bedId: 13, roomId: 2002, bedNo: 1, bedStatus: 1 },
  { bedId: 14, roomId: 2002, bedNo: 2, bedStatus: 0 },
  { bedId: 15, roomId: 2002, bedNo: 3, bedStatus: 2 },
  { bedId: 16, roomId: 2002, bedNo: 4, bedStatus: 0 },
  { bedId: 17, roomId: 3001, bedNo: 1, bedStatus: 1 },
  { bedId: 18, roomId: 3001, bedNo: 2, bedStatus: 0 },
  { bedId: 19, roomId: 3001, bedNo: 3, bedStatus: 0 },
  { bedId: 20, roomId: 3001, bedNo: 4, bedStatus: 0 },
  { bedId: 21, roomId: 4001, bedNo: 1, bedStatus: 1 },
  { bedId: 22, roomId: 4001, bedNo: 2, bedStatus: 2 },
  { bedId: 23, roomId: 4001, bedNo: 3, bedStatus: 0 },
  { bedId: 24, roomId: 4001, bedNo: 4, bedStatus: 0 },
  { bedId: 25, roomId: 5001, bedNo: 1, bedStatus: 1 },
  { bedId: 26, roomId: 5001, bedNo: 2, bedStatus: 0 },
  { bedId: 27, roomId: 4002, bedNo: 1, bedStatus: 2 },
  { bedId: 28, roomId: 4002, bedNo: 2, bedStatus: 0 },
  { bedId: 29, roomId: 4002, bedNo: 3, bedStatus: 0 }
]

const patients: PatientVO[] = [
  {
    patientId: 10001,
    roomId: 1001,
    patientName: '张伟',
    gender: 1,
    address: '北京市朝阳区建国路 88 号',
    phone: '13800000001'
  },
  {
    patientId: 10002,
    roomId: 1001,
    patientName: '李娜',
    gender: 0,
    address: '北京市海淀区中关村大街 12 号',
    phone: '13800000002'
  },
  {
    patientId: 10003,
    roomId: 1002,
    patientName: '王强',
    gender: 1,
    address: '北京市西城区金融街 5 号',
    phone: '13800000003'
  },
  {
    patientId: 10004,
    roomId: 2001,
    patientName: '刘敏',
    gender: 0,
    address: '北京市东城区东直门内大街 9 号',
    phone: '13800000004'
  },
  {
    patientId: 10005,
    roomId: 2002,
    patientName: '陈杰',
    gender: 1,
    address: '北京市丰台区南三环西路 16 号',
    phone: '13800000005'
  },
  {
    patientId: 10006,
    roomId: 3001,
    patientName: '赵丽',
    gender: 0,
    address: '北京市石景山区鲁谷路 35 号',
    phone: '13800000006'
  },
  {
    patientId: 10007,
    roomId: 4001,
    patientName: '孙浩',
    gender: 1,
    address: '北京市通州区新华大街 21 号',
    phone: '13800000007'
  },
  {
    patientId: 10008,
    roomId: 5001,
    patientName: '周静',
    gender: 0,
    address: '北京市昌平区回龙观东大街 7 号',
    phone: '13800000008'
  },
  {
    patientId: 10009,
    patientName: '吴芳',
    gender: 0,
    address: '北京市大兴区黄村西大街 3 号',
    phone: '13800000009'
  },
  {
    patientId: 10010,
    patientName: '郑凯',
    gender: 1,
    address: '北京市顺义区府前街 6 号',
    phone: '13800000010'
  },
  {
    patientId: 10011,
    patientName: '冯雪',
    gender: 0,
    address: '河北省廊坊市广阳区银河路 18 号',
    phone: '13800000011'
  },
  {
    patientId: 10012,
    patientName: '何军',
    gender: 1,
    address: '天津市河西区友谊路 33 号',
    phone: '13800000012'
  }
]

const doctors: DoctorVO[] = [
  { docId: 9001, docName: '张建国', gender: 1, title: '主任医师', phone: '13900000001', dept: '内科', status: 0 },
  { docId: 9002, docName: '李慧', gender: 0, title: '副主任医师', phone: '13900000002', dept: '内科', status: 0 },
  { docId: 9003, docName: '王志强', gender: 1, title: '主任医师', phone: '13900000003', dept: '外科', status: 0 },
  { docId: 9004, docName: '赵敏', gender: 0, title: '主治医师', phone: '13900000004', dept: '外科', status: 0 },
  { docId: 9005, docName: '陈晨', gender: 1, title: '主治医师', phone: '13900000005', dept: '骨科', status: 0 },
  { docId: 9006, docName: '刘晓', gender: 0, title: '住院医师', phone: '13900000006', dept: '儿科', status: 0 },
  { docId: 9007, docName: '孙鹏', gender: 1, title: '主治医师', phone: '13900000007', dept: '内科', status: 1 }
]

const recordInhs: RecordInhVO[] = [
  { inhId: 1, patientId: 10001, roomId: 1001, bedId: 1, recordDate: '2026-11-10 09:00:00', inTime: '2026-11-10 09:20:00', outTime: null },
  { inhId: 2, patientId: 10002, roomId: 1001, bedId: 2, recordDate: '2026-11-12 14:00:00', inTime: '2026-11-12 14:05:00', outTime: null },
  { inhId: 3, patientId: 10003, roomId: 1002, bedId: 5, recordDate: '2026-11-14 10:20:00', inTime: '2026-11-14 10:30:00', outTime: null },
  { inhId: 4, patientId: 10004, roomId: 2001, bedId: 9, recordDate: '2026-11-16 08:40:00', inTime: '2026-11-16 08:45:00', outTime: null },
  { inhId: 5, patientId: 10005, roomId: 2002, bedId: 13, recordDate: '2026-11-18 16:10:00', inTime: '2026-11-18 16:20:00', outTime: null },
  { inhId: 6, patientId: 10006, roomId: 3001, bedId: 17, recordDate: '2026-11-20 11:00:00', inTime: '2026-11-20 11:10:00', outTime: null },
  { inhId: 7, patientId: 10007, roomId: 4001, bedId: 21, recordDate: '2026-11-21 08:50:00', inTime: '2026-11-21 09:00:00', outTime: null },
  { inhId: 8, patientId: 10008, roomId: 5001, bedId: 25, recordDate: '2026-11-22 20:05:00', inTime: '2026-11-22 20:15:00', outTime: null },
  { inhId: 9, patientId: 10009, roomId: 1002, bedId: 6, recordDate: '2026-10-01 10:00:00', inTime: '2026-10-01 10:05:00', outTime: '2026-10-12 09:00:00' },
  { inhId: 10, patientId: 10010, roomId: 2001, bedId: 10, recordDate: '2026-09-15 08:30:00', inTime: '2026-09-15 08:35:00', outTime: '2026-09-28 15:00:00' },
  { inhId: 11, patientId: 10009, roomId: 3001, bedId: 18, recordDate: '2026-09-01 09:00:00', inTime: '2026-09-01 09:05:00', outTime: '2026-09-10 10:30:00' },
  { inhId: 12, patientId: 10001, roomId: 1002, bedId: 7, recordDate: '2026-08-05 15:00:00', inTime: '2026-08-05 15:10:00', outTime: '2026-08-20 09:10:00' }
]

const recordTreats: RecordTreatVO[] = [
  { treatId: 1, patientId: 10001, docId: 9001, treatTime: '2026-11-10 10:30:00', diagnosis: '社区获得性肺炎', plan: '头孢曲松 2g 静滴 qd，化痰对症，监测体温及血常规' },
  { treatId: 2, patientId: 10001, docId: 9001, treatTime: '2026-11-15 09:10:00', diagnosis: '肺炎好转期', plan: '继续抗感染治疗，复查胸部 CT，逐步下调抗生素级别' },
  { treatId: 3, patientId: 10002, docId: 9002, treatTime: '2026-11-12 15:00:00', diagnosis: '2 型糖尿病', plan: '二甲双胍 0.5g 口服 bid，糖尿病饮食，监测空腹及餐后血糖' },
  { treatId: 4, patientId: 10002, docId: 9001, treatTime: '2026-11-18 10:20:00', diagnosis: '血糖控制不佳', plan: '加用甘精胰岛素 10u 睡前皮下注射，内分泌科会诊' },
  { treatId: 5, patientId: 10003, docId: 9002, treatTime: '2026-11-14 11:00:00', diagnosis: '急性胃炎', plan: '奥美拉唑 40mg 静滴 qd，补液、抑酸、护胃，清淡饮食' },
  { treatId: 6, patientId: 10004, docId: 9003, treatTime: '2026-11-16 09:30:00', diagnosis: '急性阑尾炎', plan: '急诊行腹腔镜阑尾切除术，术后抗感染、补液治疗' },
  { treatId: 7, patientId: 10004, docId: 9004, treatTime: '2026-11-20 09:00:00', diagnosis: '阑尾切除术后恢复期', plan: '切口换药，观察有无渗液，鼓励早期下床活动' },
  { treatId: 8, patientId: 10005, docId: 9003, treatTime: '2026-11-18 17:00:00', diagnosis: '胆囊结石伴慢性胆囊炎', plan: '行腹腔镜胆囊切除术，术后禁食、补液、保肝治疗' },
  { treatId: 9, patientId: 10005, docId: 9004, treatTime: '2026-11-22 10:00:00', diagnosis: '腹腔镜术后第 4 天', plan: '逐步恢复流质饮食，复查肝功能，观察引流情况' },
  { treatId: 10, patientId: 10006, docId: 9005, treatTime: '2026-11-20 14:00:00', diagnosis: '左股骨颈骨折', plan: '皮牵引制动，完善术前检查，择期行骨折内固定术' },
  { treatId: 11, patientId: 10006, docId: 9005, treatTime: '2026-11-24 09:30:00', diagnosis: '骨折内固定术后第 2 天', plan: '低分子肝素抗凝，镇痛，指导踝泵及股四头肌功能锻炼' },
  { treatId: 12, patientId: 10007, docId: 9006, treatTime: '2026-11-21 10:00:00', diagnosis: '支气管哮喘急性发作', plan: '雾化吸入布地奈德 + 沙丁胺醇，口服孟鲁司特钠，避免过敏原' },
  { treatId: 13, patientId: 10008, docId: 9001, treatTime: '2026-11-22 21:00:00', diagnosis: '感染性休克', plan: '快速液体复苏，去甲肾上腺素维持血压，广谱抗生素抗感染' },
  { treatId: 14, patientId: 10008, docId: 9002, treatTime: '2026-11-25 08:30:00', diagnosis: '休克纠正，血流动力学稳定', plan: '逐步减停血管活性药物，继续抗感染，加强营养支持' },
  { treatId: 15, patientId: 10009, docId: 9002, treatTime: '2026-10-02 10:00:00', diagnosis: '慢性非萎缩性胃炎', plan: '雷贝拉唑 10mg 口服 bid，规律饮食，忌辛辣刺激食物' },
  { treatId: 16, patientId: 10010, docId: 9003, treatTime: '2026-09-16 11:00:00', diagnosis: '右侧腹股沟疝', plan: '行无张力疝修补术，术后避免腹压增高，定期复查' },
  { treatId: 17, patientId: 10009, docId: 9001, treatTime: '2026-09-02 09:00:00', diagnosis: '上呼吸道感染', plan: '对症治疗，多饮水、注意休息，必要时口服解热镇痛药' },
  { treatId: 18, patientId: 10011, docId: 9006, treatTime: '2026-11-23 15:30:00', diagnosis: '小儿腹泻病', plan: '口服补液盐，蒙脱石散保护肠黏膜，观察尿量及精神状态' }
]

/* ============================ 派生数据组装 ============================ */

const findRoom = (roomId?: number) => rooms.find((item) => item.roomId === Number(roomId))
const findBed = (bedId?: number) => beds.find((item) => item.bedId === Number(bedId))
const findPatient = (patientId?: number) => patients.find((item) => item.patientId === Number(patientId))
const findDoctor = (docId?: number) => doctors.find((item) => item.docId === Number(docId))

/** 某床位当前在住的住院记录 */
const activeRecordByBed = (bedId: number) =>
  recordInhs.find((item) => item.bedId === bedId && !item.outTime)

/** 某病人当前在院的住院记录 */
const activeRecordByPatient = (patientId: number) =>
  recordInhs.find((item) => item.patientId === patientId && !item.outTime)

/** 某次住院期间的治疗记录 */
const treatsOfAdmission = (record: RecordInhVO) =>
  recordTreats.filter((treat) => {
    if (treat.patientId !== record.patientId) return false
    const time = dayjs(treat.treatTime).valueOf()
    if (time < dayjs(record.inTime).valueOf()) return false
    if (record.outTime && time > dayjs(record.outTime).valueOf()) return false
    return true
  })

const enrichRoom = (room: RoomVO): RoomVO => {
  const roomBeds = beds.filter((bed) => bed.roomId === room.roomId)
  return {
    ...room,
    bedCount: roomBeds.length,
    freeBedCount: roomBeds.filter((bed) => bed.bedStatus === 0).length,
    occupiedBedCount: roomBeds.filter((bed) => bed.bedStatus === 1).length,
    repairBedCount: roomBeds.filter((bed) => bed.bedStatus === 2).length
  }
}

const enrichBed = (bed: BedVO): BedVO => {
  const room = findRoom(bed.roomId)
  const record = activeRecordByBed(bed.bedId)
  const patient = record ? findPatient(record.patientId) : undefined
  return {
    ...bed,
    dept: room?.dept,
    location: room?.location,
    roomStatus: room?.status,
    patientId: patient?.patientId,
    patientName: patient?.patientName
  }
}

const enrichPatient = (patient: PatientVO): PatientVO => {
  const room = findRoom(patient.roomId)
  const record = activeRecordByPatient(patient.patientId)
  const bed = record ? findBed(record.bedId) : undefined
  return {
    ...patient,
    dept: room?.dept,
    location: room?.location,
    bedNo: bed?.bedNo,
    inHospital: !!record
  }
}

const enrichTreat = (treat: RecordTreatVO): RecordTreatVO => {
  const patient = findPatient(treat.patientId)
  const doctor = findDoctor(treat.docId)
  return {
    ...treat,
    patientName: patient?.patientName,
    gender: patient?.gender,
    docName: doctor?.docName,
    dept: doctor?.dept
  }
}

const enrichRecord = (record: RecordInhVO): RecordInhVO => {
  const patient = findPatient(record.patientId)
  const room = findRoom(record.roomId)
  const bed = findBed(record.bedId)
  const treats = treatsOfAdmission(record).sort(
    (a, b) => dayjs(b.treatTime).valueOf() - dayjs(a.treatTime).valueOf()
  )
  const latestDoctor = treats.length ? findDoctor(treats[0].docId) : undefined
  const days = calcDays(record.inTime, record.outTime)
  return {
    ...record,
    patientName: patient?.patientName,
    gender: patient?.gender,
    dept: room?.dept,
    location: room?.location,
    bedNo: bed?.bedNo,
    docName: latestDoctor?.docName,
    days,
    fee: Number((days * (room?.fee ?? 0)).toFixed(2))
  }
}

/* ============================ 病房 ============================ */

export const getRoomPage = (params: RoomPageReq): HospitalPage<RoomVO> => {
  let list = rooms.map(enrichRoom)
  if (hasValue(params.roomId)) list = list.filter((item) => includes(item.roomId, params.roomId))
  if (hasValue(params.dept)) list = list.filter((item) => item.dept === params.dept)
  if (hasValue(params.location)) list = list.filter((item) => includes(item.location, params.location))
  if (hasValue(params.status)) list = list.filter((item) => item.status === Number(params.status))
  list.sort((a, b) => a.roomId - b.roomId)
  return pageList(list, params.pageNo, params.pageSize)
}

export const getRoomList = (): RoomVO[] => {
  return clone(rooms.map(enrichRoom).sort((a, b) => a.roomId - b.roomId))
}

export const getRoom = (roomId: number): RoomVO => {
  const room = findRoom(roomId)
  if (!room) throw new Error('病房不存在')
  return clone(enrichRoom(room))
}

export const getRoomDetail = (roomId: number): RoomDetailVO => {
  const room = findRoom(roomId)
  if (!room) throw new Error('病房不存在')
  const roomBeds = beds
    .filter((bed) => bed.roomId === room.roomId)
    .sort((a, b) => a.bedNo - b.bedNo)
    .map(enrichBed)
  return { room: clone(enrichRoom(room)), beds: clone(roomBeds) }
}

export const createRoom = (data: RoomVO) => {
  const roomId = Number(data.roomId)
  if (!roomId) throw new Error('请输入病房编号')
  if (rooms.some((item) => item.roomId === roomId)) throw new Error('病房编号已存在')
  if (!data.dept) throw new Error('请选择所属科室')
  if (!data.location) throw new Error('请输入病房地点')
  rooms.push({
    roomId,
    dept: data.dept,
    location: data.location,
    fee: Number(data.fee) || 0,
    status: data.status ?? 0
  })
}

export const updateRoom = (data: RoomVO) => {
  const room = rooms.find((item) => item.roomId === Number(data.roomId))
  if (!room) throw new Error('病房不存在')
  if (!data.dept) throw new Error('请选择所属科室')
  if (!data.location) throw new Error('请输入病房地点')
  room.dept = data.dept
  room.location = data.location
  room.fee = Number(data.fee) || 0
  room.status = data.status ?? room.status
}

export const deleteRoom = (roomId: number) => {
  const index = rooms.findIndex((item) => item.roomId === Number(roomId))
  if (index === -1) throw new Error('病房不存在')
  const roomBeds = beds.filter((bed) => bed.roomId === Number(roomId))
  if (roomBeds.length > 0) {
    throw new Error(`该病房下还有 ${roomBeds.length} 张病床，请先处理病床或改为“禁用病房”`)
  }
  rooms.splice(index, 1)
}

export const updateRoomStatus = (roomId: number, status: number) => {
  const room = rooms.find((item) => item.roomId === Number(roomId))
  if (!room) throw new Error('病房不存在')
  room.status = Number(status)
}

/* ============================ 病床 ============================ */

export const getBedPage = (params: BedPageReq): HospitalPage<BedVO> => {
  let list = beds.map(enrichBed)
  if (hasValue(params.roomId)) list = list.filter((item) => item.roomId === Number(params.roomId))
  if (hasValue(params.dept)) list = list.filter((item) => item.dept === params.dept)
  if (hasValue(params.bedStatus)) list = list.filter((item) => item.bedStatus === Number(params.bedStatus))
  list.sort((a, b) => a.roomId - b.roomId || a.bedNo - b.bedNo)
  return pageList(list, params.pageNo, params.pageSize)
}

export const getBedList = (params: BedListReq = {}): BedVO[] => {
  let list = beds.map(enrichBed)
  if (hasValue(params.roomId)) list = list.filter((item) => item.roomId === Number(params.roomId))
  if (hasValue(params.bedStatus)) list = list.filter((item) => item.bedStatus === Number(params.bedStatus))
  list.sort((a, b) => a.roomId - b.roomId || a.bedNo - b.bedNo)
  return clone(list)
}

export const getBed = (bedId: number): BedVO => {
  const bed = findBed(bedId)
  if (!bed) throw new Error('床位不存在')
  return clone(enrichBed(bed))
}

export const createBed = (data: BedVO) => {
  const room = findRoom(data.roomId)
  if (!room) throw new Error('请选择病房')
  if (room.status === 1) throw new Error('该病房已禁用，不能新增病床')
  const bedNo = Number(data.bedNo)
  if (!bedNo || bedNo < 1) throw new Error('床位号必须为正整数')
  if (beds.some((item) => item.roomId === room.roomId && item.bedNo === bedNo)) {
    throw new Error(`病房 ${room.roomId} 内已存在 ${bedNo} 号床位`)
  }
  beds.push({
    bedId: nextId(beds, (item) => item.bedId),
    roomId: room.roomId,
    bedNo,
    bedStatus: Number(data.bedStatus ?? 0)
  })
}

export const updateBed = (data: BedVO) => {
  const bed = findBed(data.bedId)
  if (!bed) throw new Error('床位不存在')
  const room = findRoom(data.roomId)
  if (!room) throw new Error('请选择病房')
  const bedNo = Number(data.bedNo)
  if (!bedNo || bedNo < 1) throw new Error('床位号必须为正整数')
  if (
    beds.some(
      (item) => item.bedId !== bed.bedId && item.roomId === room.roomId && item.bedNo === bedNo
    )
  ) {
    throw new Error(`病房 ${room.roomId} 内已存在 ${bedNo} 号床位`)
  }
  if (bed.bedStatus === 1 && (bed.roomId !== room.roomId || bed.bedNo !== bedNo)) {
    throw new Error('该床位有在院病人，不能修改病房或床位号，请先办理换床或出院')
  }
  bed.roomId = room.roomId
  bed.bedNo = bedNo
  // 占用状态只能由入院 / 出院 / 换床流程维护，这里不允许手工改成“占用”
  if (Number(data.bedStatus) !== 1) {
    bed.bedStatus = Number(data.bedStatus)
  }
}

export const deleteBed = (bedId: number) => {
  const bed = findBed(bedId)
  if (!bed) throw new Error('床位不存在')
  if (bed.bedStatus === 1 || activeRecordByBed(bed.bedId)) {
    throw new Error('该床位正在使用中，不能删除，请先办理出院或换床')
  }
  beds.splice(beds.indexOf(bed), 1)
}

export const updateBedStatus = (bedId: number, bedStatus: number) => {
  const bed = findBed(bedId)
  if (!bed) throw new Error('床位不存在')
  if (Number(bedStatus) === 1) throw new Error('“占用”状态由入院登记自动维护，不能手动设置')
  if (bed.bedStatus === 1 || activeRecordByBed(bed.bedId)) {
    throw new Error('该床位有在院病人，请先办理出院或换床')
  }
  bed.bedStatus = Number(bedStatus)
}

/* ============================ 病人 ============================ */

export const getPatientPage = (params: PatientPageReq): HospitalPage<PatientVO> => {
  let list = patients.map(enrichPatient)
  if (hasValue(params.patientId)) list = list.filter((item) => includes(item.patientId, params.patientId))
  if (hasValue(params.patientName)) list = list.filter((item) => includes(item.patientName, params.patientName))
  if (hasValue(params.phone)) list = list.filter((item) => includes(item.phone, params.phone))
  if (hasValue(params.roomId)) list = list.filter((item) => item.roomId === Number(params.roomId))
  if (hasValue(params.gender)) list = list.filter((item) => item.gender === Number(params.gender))
  list.sort((a, b) => a.patientId - b.patientId)
  return pageList(list, params.pageNo, params.pageSize)
}

export const getPatientList = (): PatientVO[] => {
  return clone(patients.map(enrichPatient).sort((a, b) => a.patientId - b.patientId))
}

export const getPatient = (patientId: number): PatientVO => {
  const patient = findPatient(patientId)
  if (!patient) throw new Error('病人不存在')
  return clone(enrichPatient(patient))
}

export const getPatientDetail = (patientId: number): PatientDetailVO => {
  const patient = findPatient(patientId)
  if (!patient) throw new Error('病人不存在')
  const records = recordInhs
    .filter((item) => item.patientId === patient.patientId)
    .sort((a, b) => dayjs(b.inTime).valueOf() - dayjs(a.inTime).valueOf())
    .map(enrichRecord)
  const treats = recordTreats
    .filter((item) => item.patientId === patient.patientId)
    .sort((a, b) => dayjs(b.treatTime).valueOf() - dayjs(a.treatTime).valueOf())
    .map(enrichTreat)
  return {
    patient: clone(enrichPatient(patient)),
    records: clone(records),
    treats: clone(treats)
  }
}

export const createPatient = (data: PatientVO) => {
  const patientId = Number(data.patientId)
  if (!patientId) throw new Error('请输入病案号')
  if (patients.some((item) => item.patientId === patientId)) throw new Error('病案号已存在')
  if (!data.patientName) throw new Error('请输入病人姓名')
  if (!data.phone) throw new Error('请输入联系电话')
  patients.push({
    patientId,
    patientName: data.patientName,
    gender: Number(data.gender ?? 1),
    phone: data.phone,
    address: data.address,
    roomId: hasValue(data.roomId) ? Number(data.roomId) : undefined
  })
}

export const updatePatient = (data: PatientVO) => {
  const patient = findPatient(data.patientId)
  if (!patient) throw new Error('病人不存在')
  if (!data.patientName) throw new Error('请输入病人姓名')
  if (!data.phone) throw new Error('请输入联系电话')
  const inHospital = !!activeRecordByPatient(patient.patientId)
  if (inHospital && Number(data.roomId) !== Number(patient.roomId)) {
    throw new Error('该病人当前在院，病房/床位请通过“换床”调整')
  }
  patient.patientName = data.patientName
  patient.gender = Number(data.gender ?? patient.gender)
  patient.phone = data.phone
  patient.address = data.address
  patient.roomId = hasValue(data.roomId) ? Number(data.roomId) : undefined
}

export const deletePatient = (patientId: number) => {
  const patient = findPatient(patientId)
  if (!patient) throw new Error('病人不存在')
  if (activeRecordByPatient(patient.patientId)) throw new Error('该病人当前在院，不能删除')
  if (recordInhs.some((item) => item.patientId === patient.patientId)) {
    throw new Error('该病人存在住院历史记录，历史数据不允许删除')
  }
  if (recordTreats.some((item) => item.patientId === patient.patientId)) {
    throw new Error('该病人存在治疗记录，历史数据不允许删除')
  }
  patients.splice(patients.indexOf(patient), 1)
}

/* ============================ 医生 ============================ */

export const getDoctorPage = (params: DoctorPageReq): HospitalPage<DoctorVO> => {
  let list = doctors.map((item) => clone(item))
  if (hasValue(params.docId)) list = list.filter((item) => includes(item.docId, params.docId))
  if (hasValue(params.docName)) list = list.filter((item) => includes(item.docName, params.docName))
  if (hasValue(params.dept)) list = list.filter((item) => item.dept === params.dept)
  if (hasValue(params.title)) list = list.filter((item) => item.title === params.title)
  if (hasValue(params.status)) list = list.filter((item) => item.status === Number(params.status))
  list.sort((a, b) => a.docId - b.docId)
  return pageList(list, params.pageNo, params.pageSize)
}

export const getDoctorList = (status?: number): DoctorVO[] => {
  const list = hasValue(status) ? doctors.filter((item) => item.status === status) : doctors
  return clone([...list].sort((a, b) => a.docId - b.docId))
}

export const getDoctor = (docId: number): DoctorVO => {
  const doctor = findDoctor(docId)
  if (!doctor) throw new Error('医生不存在')
  return clone(doctor)
}

export const getDoctorDetail = (docId: number): DoctorDetailVO => {
  const doctor = findDoctor(docId)
  if (!doctor) throw new Error('医生不存在')
  const treats = recordTreats
    .filter((item) => item.docId === doctor.docId)
    .sort((a, b) => dayjs(b.treatTime).valueOf() - dayjs(a.treatTime).valueOf())
    .map(enrichTreat)
  // 由治疗记录反推该医生负责过的病人
  const patientMap = new Map<number, DoctorPatientVO>()
  treats.forEach((treat) => {
    const patient = findPatient(treat.patientId)
    if (!patient) return
    const exist = patientMap.get(patient.patientId)
    if (exist) {
      exist.treatCount += 1
      if (dayjs(treat.treatTime).valueOf() > dayjs(exist.lastTreatTime).valueOf()) {
        exist.lastTreatTime = treat.treatTime
      }
    } else {
      patientMap.set(patient.patientId, {
        patientId: patient.patientId,
        patientName: patient.patientName,
        gender: patient.gender,
        treatCount: 1,
        lastTreatTime: treat.treatTime
      })
    }
  })
  const patientsOfDoctor = [...patientMap.values()].sort(
    (a, b) => dayjs(b.lastTreatTime).valueOf() - dayjs(a.lastTreatTime).valueOf()
  )
  return { doctor: clone(doctor), treats: clone(treats), patients: clone(patientsOfDoctor) }
}

export const createDoctor = (data: DoctorVO) => {
  const docId = Number(data.docId)
  if (!docId) throw new Error('请输入医生编号')
  if (doctors.some((item) => item.docId === docId)) throw new Error('医生编号已存在')
  if (!data.docName) throw new Error('请输入医生姓名')
  if (!data.dept) throw new Error('请选择所属科室')
  if (!data.title) throw new Error('请选择职称')
  if (!data.phone) throw new Error('请输入联系电话')
  doctors.push({
    docId,
    docName: data.docName,
    gender: Number(data.gender ?? 1),
    title: data.title,
    phone: data.phone,
    dept: data.dept,
    status: Number(data.status ?? 0)
  })
}

export const updateDoctor = (data: DoctorVO) => {
  const doctor = findDoctor(data.docId)
  if (!doctor) throw new Error('医生不存在')
  if (!data.docName) throw new Error('请输入医生姓名')
  if (!data.dept) throw new Error('请选择所属科室')
  if (!data.title) throw new Error('请选择职称')
  if (!data.phone) throw new Error('请输入联系电话')
  doctor.docName = data.docName
  doctor.gender = Number(data.gender ?? doctor.gender)
  doctor.title = data.title
  doctor.phone = data.phone
  doctor.dept = data.dept
  doctor.status = Number(data.status ?? doctor.status)
}

export const updateDoctorStatus = (docId: number, status: number) => {
  const doctor = findDoctor(docId)
  if (!doctor) throw new Error('医生不存在')
  doctor.status = Number(status)
}

export const deleteDoctor = (docId: number) => {
  const doctor = findDoctor(docId)
  if (!doctor) throw new Error('医生不存在')
  if (recordTreats.some((item) => item.docId === doctor.docId)) {
    throw new Error('该医生存在治疗记录，历史数据不允许删除，可改为“停用”')
  }
  doctors.splice(doctors.indexOf(doctor), 1)
}

/* ============================ 住院记录 ============================ */

export const getRecordPage = (params: RecordPageReq): HospitalPage<RecordInhVO> => {
  let list = recordInhs.map(enrichRecord)
  if (hasValue(params.patientId)) list = list.filter((item) => includes(item.patientId, params.patientId))
  if (hasValue(params.patientName)) list = list.filter((item) => includes(item.patientName, params.patientName))
  if (hasValue(params.dept)) list = list.filter((item) => item.dept === params.dept)
  if (hasValue(params.roomId)) list = list.filter((item) => item.roomId === Number(params.roomId))
  if (hasValue(params.bedId)) list = list.filter((item) => item.bedId === Number(params.bedId))
  if (params.status === 'in') list = list.filter((item) => !item.outTime)
  if (params.status === 'out') list = list.filter((item) => !!item.outTime)
  if (hasValue(params.beginTime)) {
    list = list.filter((item) => dayjs(item.inTime).valueOf() >= dayjs(params.beginTime).startOf('day').valueOf())
  }
  if (hasValue(params.endTime)) {
    list = list.filter((item) => dayjs(item.inTime).valueOf() <= dayjs(params.endTime).endOf('day').valueOf())
  }
  list.sort((a, b) => dayjs(b.inTime).valueOf() - dayjs(a.inTime).valueOf())
  return pageList(list, params.pageNo, params.pageSize)
}

export const getInHospitalList = (): RecordInhVO[] => {
  return clone(
    recordInhs
      .filter((item) => !item.outTime)
      .sort((a, b) => dayjs(b.inTime).valueOf() - dayjs(a.inTime).valueOf())
      .map(enrichRecord)
  )
}

export const getLedger = (params: LedgerReq = {}): RecordInhVO[] => {
  let list = recordInhs.map(enrichRecord)
  if (hasValue(params.patientId)) list = list.filter((item) => includes(item.patientId, params.patientId))
  if (hasValue(params.patientName)) list = list.filter((item) => includes(item.patientName, params.patientName))
  if (hasValue(params.beginTime)) {
    list = list.filter((item) => inRange(item.inTime, params.beginTime, params.endTime))
  } else if (hasValue(params.endTime)) {
    list = list.filter((item) => inRange(item.inTime, undefined, params.endTime))
  }
  list.sort((a, b) => dayjs(b.inTime).valueOf() - dayjs(a.inTime).valueOf())
  return clone(list)
}

export const getRecord = (inhId: number): RecordDetailVO => {
  const record = recordInhs.find((item) => item.inhId === Number(inhId))
  if (!record) throw new Error('住院记录不存在')
  const treats = treatsOfAdmission(record)
    .sort((a, b) => dayjs(a.treatTime).valueOf() - dayjs(b.treatTime).valueOf())
    .map(enrichTreat)
  return { record: clone(enrichRecord(record)), treats: clone(treats) }
}

export const createRecord = (data: AdmissionReq): number => {
  const patient = findPatient(data.patientId)
  if (!patient) throw new Error('病人不存在，请先建立病人档案')
  const room = findRoom(data.roomId)
  if (!room) throw new Error('请选择病房')
  if (room.status === 1) throw new Error('该病房已禁用，不能分配床位')
  const bed = findBed(data.bedId)
  if (!bed) throw new Error('请选择床位')
  if (bed.roomId !== room.roomId) throw new Error('所选床位不属于该病房')
  if (bed.bedStatus !== 0) throw new Error('该床位当前不可分配（已占用或维修中）')
  if (activeRecordByPatient(patient.patientId)) throw new Error('该病人已在院，请勿重复登记入院')
  const inTime = dayjs(data.inTime)
  if (!inTime.isValid()) throw new Error('请选择入院时间')

  const inhId = nextId(recordInhs, (item) => item.inhId)
  recordInhs.push({
    inhId,
    patientId: patient.patientId,
    roomId: room.roomId,
    bedId: bed.bedId,
    recordDate: NOW(),
    inTime: inTime.format('YYYY-MM-DD HH:mm:ss'),
    outTime: null
  })
  // 入院成功后：床位改为占用，病人表的当前病房同步更新
  bed.bedStatus = 1
  patient.roomId = room.roomId
  return inhId
}

export const dischargeRecord = (inhId: number, outTime: string) => {
  const record = recordInhs.find((item) => item.inhId === Number(inhId))
  if (!record) throw new Error('住院记录不存在')
  if (record.outTime) throw new Error('该住院记录已办理出院')
  const out = dayjs(outTime)
  if (!out.isValid()) throw new Error('请选择出院时间')
  if (out.valueOf() < dayjs(record.inTime).valueOf()) throw new Error('出院时间不能早于入院时间')

  record.outTime = out.format('YYYY-MM-DD HH:mm:ss')
  const bed = findBed(record.bedId)
  if (bed) bed.bedStatus = 0
  const patient = findPatient(record.patientId)
  if (patient) patient.roomId = undefined
}

export const changeRecordBed = (data: ChangeBedReq) => {
  const record = recordInhs.find((item) => item.inhId === Number(data.inhId))
  if (!record) throw new Error('住院记录不存在')
  if (record.outTime) throw new Error('该病人已出院，无法换床')
  const newRoom = findRoom(data.roomId)
  if (!newRoom) throw new Error('请选择病房')
  if (newRoom.status === 1) throw new Error('该病房已禁用，不能分配床位')
  const newBed = findBed(data.bedId)
  if (!newBed) throw new Error('请选择床位')
  if (newBed.roomId !== newRoom.roomId) throw new Error('所选床位不属于该病房')
  if (newBed.bedId === record.bedId) throw new Error('新床位与当前床位相同')
  if (newBed.bedStatus !== 0) throw new Error('新床位当前不可用（已占用或维修中）')

  const oldBed = findBed(record.bedId)
  if (oldBed) oldBed.bedStatus = 0
  newBed.bedStatus = 1
  record.roomId = newRoom.roomId
  record.bedId = newBed.bedId
  const patient = findPatient(record.patientId)
  if (patient) patient.roomId = newRoom.roomId
}

/* ============================ 治疗记录 ============================ */

export const getTreatPage = (params: TreatPageReq): HospitalPage<RecordTreatVO> => {
  let list = recordTreats.map(enrichTreat)
  if (hasValue(params.keyword)) {
    list = list.filter(
      (item) =>
        includes(item.patientId, params.keyword) ||
        includes(item.patientName, params.keyword) ||
        includes(item.diagnosis, params.keyword)
    )
  }
  if (hasValue(params.docId)) list = list.filter((item) => item.docId === Number(params.docId))
  if (hasValue(params.beginTime)) {
    list = list.filter((item) => dayjs(item.treatTime).valueOf() >= dayjs(params.beginTime).startOf('day').valueOf())
  }
  if (hasValue(params.endTime)) {
    list = list.filter((item) => dayjs(item.treatTime).valueOf() <= dayjs(params.endTime).endOf('day').valueOf())
  }
  list.sort((a, b) => dayjs(b.treatTime).valueOf() - dayjs(a.treatTime).valueOf())
  return pageList(list, params.pageNo, params.pageSize)
}

export const getTreat = (treatId: number): RecordTreatVO => {
  const treat = recordTreats.find((item) => item.treatId === Number(treatId))
  if (!treat) throw new Error('治疗记录不存在')
  return clone(enrichTreat(treat))
}

export const createTreat = (data: RecordTreatVO) => {
  const patient = findPatient(data.patientId)
  if (!patient) throw new Error('病人不存在，请先建立病人档案')
  const doctor = findDoctor(data.docId)
  if (!doctor) throw new Error('请选择医生')
  if (doctor.status === 1) throw new Error('该医生已停用，不能新增治疗记录')
  const treatTime = dayjs(data.treatTime)
  if (!treatTime.isValid()) throw new Error('请选择治疗时间')
  if (!data.diagnosis) throw new Error('请输入诊断')
  if (!data.plan) throw new Error('请输入治疗方案')

  recordTreats.push({
    treatId: nextId(recordTreats, (item) => item.treatId),
    patientId: patient.patientId,
    docId: doctor.docId,
    treatTime: treatTime.format('YYYY-MM-DD HH:mm:ss'),
    diagnosis: data.diagnosis,
    plan: data.plan
  })
}

export const updateTreat = (data: RecordTreatVO) => {
  const treat = recordTreats.find((item) => item.treatId === Number(data.treatId))
  if (!treat) throw new Error('治疗记录不存在')
  const patient = findPatient(data.patientId)
  if (!patient) throw new Error('病人不存在')
  const doctor = findDoctor(data.docId)
  if (!doctor) throw new Error('请选择医生')
  const treatTime = dayjs(data.treatTime)
  if (!treatTime.isValid()) throw new Error('请选择治疗时间')
  if (!data.diagnosis) throw new Error('请输入诊断')
  if (!data.plan) throw new Error('请输入治疗方案')

  treat.patientId = patient.patientId
  treat.docId = doctor.docId
  treat.treatTime = treatTime.format('YYYY-MM-DD HH:mm:ss')
  treat.diagnosis = data.diagnosis
  treat.plan = data.plan
}

/* ============================ 统计报表 ============================ */

export const getBedUsage = (): BedUsageVO[] => {
  return clone(
    rooms
      .map((room) => {
        const roomBeds = beds.filter((bed) => bed.roomId === room.roomId)
        const occupied = roomBeds.filter((bed) => bed.bedStatus === 1).length
        const free = roomBeds.filter((bed) => bed.bedStatus === 0).length
        const repair = roomBeds.filter((bed) => bed.bedStatus === 2).length
        return {
          roomId: room.roomId,
          dept: room.dept,
          location: room.location,
          fee: room.fee,
          total: roomBeds.length,
          free,
          occupied,
          repair,
          usageRate: roomBeds.length ? Math.round((occupied / roomBeds.length) * 100) : 0
        }
      })
      .sort((a, b) => a.roomId - b.roomId)
  )
}

export const getDoctorWorkload = (beginTime?: string, endTime?: string): DoctorWorkloadVO[] => {
  const list = doctors
    .filter((doctor) => doctor.status === 0)
    .map((doctor) => {
      const treats = recordTreats.filter(
        (item) =>
          item.docId === doctor.docId && inRange(item.treatTime, beginTime, endTime)
      )
      return {
        docId: doctor.docId,
        docName: doctor.docName,
        dept: doctor.dept,
        title: doctor.title,
        treatCount: treats.length,
        patientCount: new Set(treats.map((item) => item.patientId)).size
      }
    })
    .sort((a, b) => b.treatCount - a.treatCount)
  return clone(list)
}

export const getOverview = (): HospitalOverviewVO => {
  const activeRecords = recordInhs.filter((item) => !item.outTime)
  const free = beds.filter((bed) => bed.bedStatus === 0).length
  const occupied = beds.filter((bed) => bed.bedStatus === 1).length
  const repair = beds.filter((bed) => bed.bedStatus === 2).length
  const today = dayjs().format('YYYY-MM-DD')
  return {
    inHospitalCount: activeRecords.length,
    patientCount: patients.length,
    doctorCount: doctors.filter((item) => item.status === 0).length,
    bedTotal: beds.length,
    bedFree: free,
    bedOccupied: occupied,
    bedRepair: repair,
    bedUsageRate: beds.length ? Math.round((occupied / beds.length) * 100) : 0,
    todayAdmissionCount: recordInhs.filter((item) => dayjs(item.recordDate).format('YYYY-MM-DD') === today).length
  }
}