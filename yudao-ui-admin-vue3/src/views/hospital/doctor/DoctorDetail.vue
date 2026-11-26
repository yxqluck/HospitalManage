<template>
  <el-drawer v-model="visible" title="医生档案详情" size="900px">
    <div v-loading="loading">
      <template v-if="detail">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="医生编号">{{ detail.doctor.docId }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ detail.doctor.docName }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ genderLabel(detail.doctor.gender) }}
          </el-descriptions-item>
          <el-descriptions-item label="职称">{{ detail.doctor.title }}</el-descriptions-item>
          <el-descriptions-item label="所属科室">{{ detail.doctor.dept }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detail.doctor.phone }}</el-descriptions-item>
          <el-descriptions-item label="状态" :span="3">
            <el-tag :type="DOCTOR_STATUS_CONFIG[detail.doctor.status]?.type">
              {{ DOCTOR_STATUS_CONFIG[detail.doctor.status]?.label }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="activeTab" class="mt-15px">
          <el-tab-pane :label="`负责病人（${detail.patients.length}）`" name="patients">
            <el-table :data="detail.patients" size="small" stripe>
              <el-table-column label="病案号" prop="patientId" align="center" width="120" />
              <el-table-column label="病人姓名" prop="patientName" align="center" width="120" />
              <el-table-column label="性别" align="center" width="80">
                <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
              </el-table-column>
              <el-table-column label="治疗次数" prop="treatCount" align="center" width="110" />
              <el-table-column label="最近治疗时间" align="center" min-width="160">
                <template #default="{ row }">{{ formatDateTime(row.lastTreatTime) }}</template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane :label="`治疗记录（${detail.treats.length}）`" name="treats">
            <el-table :data="detail.treats" size="small" stripe>
              <el-table-column label="治疗时间" align="center" width="150">
                <template #default="{ row }">{{ formatDateTime(row.treatTime) }}</template>
              </el-table-column>
              <el-table-column label="病案号" prop="patientId" align="center" width="100" />
              <el-table-column label="病人" prop="patientName" align="center" width="100" />
              <el-table-column label="诊断" prop="diagnosis" min-width="160" show-overflow-tooltip />
              <el-table-column label="治疗方案" prop="plan" min-width="240" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import * as DoctorApi from '@/api/hospital/doctor'
import type { DoctorDetailVO } from '@/api/hospital/types'
import { DOCTOR_STATUS_CONFIG, genderLabel } from '../constants'
import { formatDateTime } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalDoctorDetail' })

const { reportError } = useHospitalFeedback()

const visible = ref(false)
const loading = ref(false)
const detail = ref<DoctorDetailVO>()
const activeTab = ref('patients')

const open = async (docId: number) => {
  visible.value = true
  loading.value = true
  detail.value = undefined
  activeTab.value = 'patients'
  try {
    detail.value = await DoctorApi.getDoctorDetail(docId)
  } catch (error) {
    reportError(error)
  } finally {
    loading.value = false
  }
}
defineExpose({ open })
</script>