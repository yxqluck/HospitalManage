<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="病人 / 诊断" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="病案号 / 姓名 / 诊断"
          clearable
          class="!w-220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主治医生" prop="docId">
        <el-select v-model="queryParams.docId" placeholder="全部医生" clearable class="!w-190px">
          <el-option
            v-for="doctor in doctorOptions"
            :key="doctor.docId"
            :label="`${doctor.docName}（${doctor.dept}）`"
            :value="doctor.docId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗时间">
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
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" /> 新增治疗记录
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="编号" align="center" prop="treatId" width="80" />
      <el-table-column label="治疗时间" align="center" width="150">
        <template #default="{ row }">{{ formatDateTime(row.treatTime) }}</template>
      </el-table-column>
      <el-table-column label="病案号" align="center" prop="patientId" width="100" />
      <el-table-column label="病人" align="center" prop="patientName" width="100" />
      <el-table-column label="主治医生" align="center" prop="docName" width="100" />
      <el-table-column label="科室" align="center" prop="dept" width="90" />
      <el-table-column label="诊断" align="left" prop="diagnosis" min-width="200" show-overflow-tooltip />
      <el-table-column label="治疗方案" align="left" prop="plan" min-width="280" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('update', row.treatId)">编辑</el-button>
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

  <TreatForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import * as TreatApi from '@/api/hospital/record-treat'
import * as DoctorApi from '@/api/hospital/doctor'
import type { DoctorVO, RecordTreatVO, TreatPageReq } from '@/api/hospital/types'
import { formatDateTime } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'
import TreatForm from './TreatForm.vue'

defineOptions({ name: 'HospitalTreat' })

const { reportError } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<RecordTreatVO[]>([])
const doctorOptions = ref<DoctorVO[]>([])
const dateRange = ref<[string, string] | null>(null)
const queryParams = reactive<TreatPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await TreatApi.getTreatPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询治疗记录失败')
  } finally {
    loading.value = false
  }
}

const loadDoctors = async () => {
  try {
    doctorOptions.value = await DoctorApi.getDoctorList()
  } catch (error) {
    reportError(error, '查询医生列表失败')
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

const formRef = ref()
const openForm = (type: string, treatId?: number) => {
  formRef.value?.open(type, treatId)
}

onMounted(async () => {
  await loadDoctors()
  getList()
})
</script>