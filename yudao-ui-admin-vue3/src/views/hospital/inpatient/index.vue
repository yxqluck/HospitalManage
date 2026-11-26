<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="76px"
    >
      <el-form-item label="病案号" prop="patientId">
        <el-input
          v-model="queryParams.patientId"
          placeholder="请输入病案号"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病人姓名" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入病人姓名"
          clearable
          class="!w-160px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室" prop="dept">
        <el-select v-model="queryParams.dept" placeholder="全部科室" clearable class="!w-150px">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="病房" prop="roomId">
        <el-select v-model="queryParams.roomId" placeholder="全部病房" clearable class="!w-190px">
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.dept}）`"
            :value="room.roomId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-130px">
          <el-option label="在院" value="in" />
          <el-option label="已出院" value="out" />
        </el-select>
      </el-form-item>
      <el-form-item label="入院日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="!w-260px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openAdmission">
          <Icon icon="ep:plus" class="mr-5px" /> 入院登记
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="住院号" align="center" prop="inhId" width="80" />
      <el-table-column label="病人" align="left" width="150">
        <template #default="{ row }">
          <div>{{ row.patientName }}</div>
          <div class="text-12px text-[var(--el-text-color-secondary)]">{{ row.patientId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="70">
        <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
      </el-table-column>
      <el-table-column label="科室" align="center" prop="dept" width="80" />
      <el-table-column label="病房 / 床位" align="center" width="130">
        <template #default="{ row }">{{ row.roomId }} / {{ row.bedNo }} 床</template>
      </el-table-column>
      <el-table-column label="入院时间" align="center" width="140">
        <template #default="{ row }">{{ formatDateTime(row.inTime) }}</template>
      </el-table-column>
      <el-table-column label="出院时间" align="center" width="140">
        <template #default="{ row }">
          <span v-if="row.outTime">{{ formatDateTime(row.outTime) }}</span>
          <span v-else class="text-[var(--el-text-color-secondary)]">在院中</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="90">
        <template #default="{ row }">
          <el-tag :type="row.outTime ? 'info' : 'success'" size="small">
            {{ row.outTime ? '已出院' : '在院' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="住院天数" align="center" width="90">
        <template #default="{ row }">{{ row.days }} 天</template>
      </el-table-column>
      <el-table-column label="预计费用" align="right" width="110">
        <template #default="{ row }">{{ formatMoney(row.fee) }}</template>
      </el-table-column>
      <el-table-column label="主治医生" align="center" prop="docName" width="100">
        <template #default="{ row }">
          {{ row.docName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button v-if="!row.outTime" link type="success" @click="openDischarge(row)">
            出院
          </el-button>
          <el-button v-if="!row.outTime" link type="warning" @click="openChangeBed(row)">
            换床
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <AdmissionForm ref="admissionRef" :room-options="roomOptions" @success="getList" />
  <DischargeForm ref="dischargeRef" @success="getList" />
  <ChangeBedForm ref="changeBedRef" :room-options="roomOptions" @success="getList" />
  <InpatientDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import * as RecordApi from '@/api/hospital/record-inh'
import * as RoomApi from '@/api/hospital/room'
import type { RecordInhVO, RecordPageReq, RoomVO } from '@/api/hospital/types'
import { DEPT_OPTIONS, genderLabel } from '../constants'
import { formatDateTime, formatMoney } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'
import AdmissionForm from './AdmissionForm.vue'
import DischargeForm from './DischargeForm.vue'
import ChangeBedForm from './ChangeBedForm.vue'
import InpatientDetail from './InpatientDetail.vue'

defineOptions({ name: 'HospitalInpatient' })

const { reportError } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<RecordInhVO[]>([])
const roomOptions = ref<RoomVO[]>([])
const dateRange = ref<[string, string] | null>(null)

const queryParams = reactive<RecordPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await RecordApi.getRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询住院记录失败')
  } finally {
    loading.value = false
  }
}

const loadRooms = async () => {
  try {
    roomOptions.value = await RoomApi.getRoomList()
  } catch (error) {
    reportError(error, '查询病房列表失败')
  }
}

const handleQuery = () => {
  queryParams.beginTime = dateRange.value?.[0]
  queryParams.endTime = dateRange.value?.[1]
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  dateRange.value = null
  queryParams.beginTime = undefined
  queryParams.endTime = undefined
  handleQuery()
}

/** 入院登记 */
const admissionRef = ref()
const openAdmission = () => {
  admissionRef.value?.open()
}

/** 出院办理 */
const dischargeRef = ref()
const openDischarge = (row: RecordInhVO) => {
  dischargeRef.value?.open(row)
}

/** 换床 */
const changeBedRef = ref()
const openChangeBed = (row: RecordInhVO) => {
  changeBedRef.value?.open(row)
}

/** 详情 */
const detailRef = ref()
const handleDetail = (row: RecordInhVO) => {
  detailRef.value?.open(row.inhId)
}

onMounted(async () => {
  await loadRooms()
  getList()
})
</script>