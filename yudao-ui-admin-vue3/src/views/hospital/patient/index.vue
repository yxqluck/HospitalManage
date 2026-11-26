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
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病人姓名" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入病人姓名"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          class="!w-180px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前病房" prop="roomId">
        <el-select v-model="queryParams.roomId" placeholder="全部病房" clearable class="!w-200px">
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.dept}）`"
            :value="room.roomId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="全部" clearable class="!w-120px">
          <el-option
            v-for="item in GENDER_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" /> 建立档案
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="病案号" align="center" prop="patientId" width="110" />
      <el-table-column label="姓名" align="center" prop="patientName" width="100" />
      <el-table-column label="性别" align="center" width="80">
        <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="phone" width="130" />
      <el-table-column label="地址" align="left" prop="address" min-width="190" show-overflow-tooltip />
      <el-table-column label="当前病房 / 床位" align="center" min-width="190">
        <template #default="{ row }">
          <template v-if="row.roomId">
            {{ row.roomId }}
            <span class="text-[var(--el-text-color-secondary)]">
              （{{ row.dept }}<template v-if="row.bedNo"> · {{ row.bedNo }} 床</template>）
            </span>
          </template>
          <span v-else class="text-[var(--el-text-color-secondary)]">未分配</span>
        </template>
      </el-table-column>
      <el-table-column label="在院状态" align="center" width="110">
        <template #default="{ row }">
          <el-tag :type="row.inHospital ? 'success' : 'info'">
            {{ row.inHospital ? '在院' : '未在院' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">档案详情</el-button>
          <el-button link type="primary" @click="openForm('update', row.patientId)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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

  <PatientForm ref="formRef" :room-options="roomOptions" @success="getList" />
  <PatientDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import * as PatientApi from '@/api/hospital/patient'
import * as RoomApi from '@/api/hospital/room'
import type { PatientPageReq, PatientVO, RoomVO } from '@/api/hospital/types'
import { GENDER_OPTIONS, genderLabel } from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'
import PatientForm from './PatientForm.vue'
import PatientDetail from './PatientDetail.vue'

defineOptions({ name: 'HospitalPatient' })

const { message, reportError, delConfirm } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<PatientVO[]>([])
const roomOptions = ref<RoomVO[]>([])
const queryParams = reactive<PatientPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await PatientApi.getPatientPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询病人列表失败')
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
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, patientId?: number) => {
  formRef.value?.open(type, patientId)
}

const detailRef = ref()
const handleDetail = (row: PatientVO) => {
  detailRef.value?.open(row.patientId)
}

const handleDelete = async (row: PatientVO) => {
  if (!(await delConfirm(`确定删除病人 ${row.patientName}（${row.patientId}）的档案吗？`))) return
  try {
    await PatientApi.deletePatient(row.patientId)
    message.success('删除成功')
    await getList()
  } catch (error) {
    reportError(error)
  }
}

onMounted(async () => {
  await loadRooms()
  getList()
})
</script>