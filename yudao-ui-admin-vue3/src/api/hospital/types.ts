/**
 * 医院管理模块 - 数据类型定义
 *
 * 说明：
 * 1. 字段命名与后端 DO / 数据库表保持一致（hospital_room、hospital_bed、hospital_patient、
 *    hospital_doctor、hospital_record_inh、hospital_record_treat）；
 * 2. 带「派生」注释的字段不是数据库字段，由接口在返回时 JOIN 拼装，方便前端直接展示；
 * 3. room.status、doctor.status 是「禁用病房 / 停用医生」需要的扩展字段，数据库当前没有，
 *    需要后端补列（或由后端自行实现禁用逻辑）。
 */

/** 分页结果 */
export interface HospitalPage<T> {
  list: T[]
  total: number
}

/** 分页请求公共参数 */
export interface HospitalPageReq extends PageParam {
  pageNo: number
  pageSize: number
}

/* ============================ 病房 ============================ */

/**
 * 病房
 * 对应表：hospital_room
 */
export interface RoomVO {
  /** 病房编号（主键，唯一） */
  roomId: number
  /** 地点，如：1 号楼 3 层 301 */
  location: string
  /** 收费标准，单位：元/天 */
  fee: number
  /** 所属科室 */
  dept: string
  /** 状态：0 启用，1 禁用（禁用后不能再分配床位） */
  status: number
  /** 床位数（派生） */
  bedCount?: number
  /** 空闲床位数（派生） */
  freeBedCount?: number
  /** 占用床位数（派生） */
  occupiedBedCount?: number
  /** 维修床位数（派生） */
  repairBedCount?: number
}

export interface RoomPageReq extends HospitalPageReq {
  roomId?: number | string
  dept?: string
  location?: string
  status?: number
}

/** 病房详情：病房 + 该病房下的全部床位（含当前在住病人） */
export interface RoomDetailVO {
  room: RoomVO
  beds: BedVO[]
}

/* ============================ 病床 ============================ */

/**
 * 病床
 * 对应表：hospital_bed
 */
export interface BedVO {
  /** 床位编号（主键） */
  bedId: number
  /** 所属病房编号 */
  roomId: number
  /** 床位号（同一病房内唯一） */
  bedNo: number
  /** 床位状态：0 空闲，1 占用，2 维修停用 */
  bedStatus: number
  /** 所属科室（派生） */
  dept?: string
  /** 病房地点（派生） */
  location?: string
  /** 病房状态（派生） */
  roomStatus?: number
  /** 当前在住病人编号（派生） */
  patientId?: number
  /** 当前在住病人姓名（派生） */
  patientName?: string
}

export interface BedPageReq extends HospitalPageReq {
  roomId?: number
  dept?: string
  bedStatus?: number
}

export interface BedListReq {
  roomId?: number
  bedStatus?: number
}

/* ============================ 病人 ============================ */

/**
 * 病人档案
 * 对应表：hospital_patient
 */
export interface PatientVO {
  /** 病案号（主键，唯一） */
  patientId: number
  /** 当前所在病房编号（入院 / 换床时自动维护，出院后清空） */
  roomId?: number
  /** 病人姓名 */
  patientName: string
  /** 性别：1 男，0 女 */
  gender: number
  /** 地址 */
  address?: string
  /** 联系电话 */
  phone: string
  /** 当前所在科室（派生） */
  dept?: string
  /** 当前所在病房地点（派生） */
  location?: string
  /** 当前床位号（派生） */
  bedNo?: number
  /** 是否在院（派生） */
  inHospital?: boolean
}

export interface PatientPageReq extends HospitalPageReq {
  patientId?: number | string
  patientName?: string
  phone?: string
  roomId?: number
  gender?: number
}

/** 病人档案详情：档案 + 全部历史住院记录 + 全部治疗记录 */
export interface PatientDetailVO {
  patient: PatientVO
  records: RecordInhVO[]
  treats: RecordTreatVO[]
}

/* ============================ 医生 ============================ */

/**
 * 医生档案
 * 对应表：hospital_doctor
 */
export interface DoctorVO {
  /** 医生编号（主键，唯一） */
  docId: number
  /** 医生姓名 */
  docName: string
  /** 性别：1 男，0 女 */
  gender: number
  /** 职称：主任医师 / 副主任医师 / 主治医师 / 住院医师 */
  title: string
  /** 联系电话 */
  phone: string
  /** 所属科室 */
  dept: string
  /** 状态：0 在岗，1 停用（扩展字段） */
  status: number
}

export interface DoctorPageReq extends HospitalPageReq {
  docId?: number | string
  docName?: string
  dept?: string
  title?: string
  status?: number
}

/** 医生负责过的病人（派生统计） */
export interface DoctorPatientVO {
  patientId: number
  patientName: string
  gender: number
  /** 治疗次数 */
  treatCount: number
  /** 最近一次治疗时间 */
  lastTreatTime: string
}

/** 医生档案详情：档案 + 治疗记录 + 负责过的病人 */
export interface DoctorDetailVO {
  doctor: DoctorVO
  treats: RecordTreatVO[]
  patients: DoctorPatientVO[]
}

/* ============================ 住院记录 ============================ */

/**
 * 住院记录
 * 对应表：hospital_record_inh
 */
export interface RecordInhVO {
  /** 住院记录编号（主键） */
  inhId: number
  /** 病房编号 */
  roomId: number
  /** 床位编号 */
  bedId: number
  /** 病案号 */
  patientId: number
  /** 登记日期 */
  recordDate: string
  /** 入院时间 */
  inTime: string
  /** 出院时间，为空表示在院 */
  outTime?: string | null
  /** 病人姓名（派生） */
  patientName?: string
  /** 性别（派生） */
  gender?: number
  /** 科室（派生） */
  dept?: string
  /** 病房地点（派生） */
  location?: string
  /** 床位号（派生） */
  bedNo?: number
  /** 主治医生（派生：本次住院最近一条治疗记录的医生） */
  docName?: string
  /** 住院天数（派生） */
  days?: number
  /** 预计住院费用（派生：住院天数 × 病房收费标准） */
  fee?: number
}

export interface RecordPageReq extends HospitalPageReq {
  patientId?: number | string
  patientName?: string
  dept?: string
  roomId?: number
  bedId?: number
  /** in 在院 / out 已出院，为空表示全部 */
  status?: '' | 'in' | 'out'
  /** 入院日期范围-开始 */
  beginTime?: string
  /** 入院日期范围-结束 */
  endTime?: string
}

/** 入院登记请求 */
export interface AdmissionReq {
  patientId: number
  roomId: number
  bedId: number
  inTime: string
}

/** 换床请求 */
export interface ChangeBedReq {
  inhId: number
  roomId: number
  bedId: number
}

/** 住院详情：住院记录 + 本次住院期间的治疗记录 */
export interface RecordDetailVO {
  record: RecordInhVO
  treats: RecordTreatVO[]
}

/* ============================ 治疗记录 ============================ */

/**
 * 治疗记录
 * 对应表：hospital_record_treat
 */
export interface RecordTreatVO {
  /** 治疗记录编号（主键） */
  treatId: number
  /** 病案号 */
  patientId: number
  /** 医生编号 */
  docId: number
  /** 治疗时间 */
  treatTime: string
  /** 诊断 */
  diagnosis: string
  /** 治疗方案 */
  plan: string
  /** 病人姓名（派生） */
  patientName?: string
  /** 性别（派生） */
  gender?: number
  /** 医生姓名（派生） */
  docName?: string
  /** 科室（派生） */
  dept?: string
}

export interface TreatPageReq extends HospitalPageReq {
  /** 病案号 / 病人姓名 / 诊断 关键字 */
  keyword?: string
  docId?: number
  /** 治疗时间范围-开始 */
  beginTime?: string
  /** 治疗时间范围-结束 */
  endTime?: string
}

/* ============================ 统计报表 ============================ */

/** 床位使用统计（按病房汇总） */
export interface BedUsageVO {
  roomId: number
  dept: string
  location: string
  fee: number
  /** 床位总数 */
  total: number
  /** 空闲 */
  free: number
  /** 占用 */
  occupied: number
  /** 维修停用 */
  repair: number
  /** 使用率，0 ~ 100 */
  usageRate: number
}

/** 医生工作量统计 */
export interface DoctorWorkloadVO {
  docId: number
  docName: string
  dept: string
  title: string
  /** 治疗人次 */
  treatCount: number
  /** 负责病人数 */
  patientCount: number
}

/** 首页 / 统计页概览指标 */
export interface HospitalOverviewVO {
  inHospitalCount: number
  patientCount: number
  doctorCount: number
  bedTotal: number
  bedFree: number
  bedOccupied: number
  bedRepair: number
  /** 床位使用率，0 ~ 100 */
  bedUsageRate: number
  /** 今日新入院人数 */
  todayAdmissionCount: number
}

/** 住院台账查询参数（复用住院记录分页，但不需要分页） */
export interface LedgerReq {
  patientId?: number | string
  patientName?: string
  beginTime?: string
  endTime?: string
}