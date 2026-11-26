<template>
  <el-drawer v-model="visible" title="病人档案详情" size="920px">
    <div v-loading="loading">
      <template v-if="detail">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="病案号">{{ detail.patient.patientId }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ detail.patient.patientName }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ genderLabel(detail.patient.gender) }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detail.patient.phone }}</el-descriptions-item>
          <el-descriptions-item label="当前病房">
            <template v-if="detail.patient.roomId">
              {{ detail.patient.roomId }}（{{ detail.patient.dept }}）
            </template>
            <template v-else>-</template>
          </el-descriptions-item>
          <el-descriptions-item label="在院状态">
            <el-tag :type="detail.patient.inHospital ? 'success' : 'info'">
              {{ detail.patient.inHospital ? '在院' : '未在院' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="家庭地址" :span="3">
            {{ detail.patient.address || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="activeTab" class="mt-15px">
          <el-tab-pane :label="`住院记录（${detail.records.length}）`" name="records">
            <el-table :data="detail.records" size="small" stripe>
              <el-table-column label="住院号" prop="inhId" align="center" width="80" />
              <el-table-column label="科室" prop="dept" align="center" width="80" />
              <el-table-column label="病房" prop="roomId" align="center" width="90" />
              <el-table-column label="床位" align="center" width="70">
                <template #default="{ row }">{{ row.bedNo }} 床</template>
              </el-table-column>
              <el-table-column label="入院时间" align="center" width="140">
                <template #default="{ row }">{{ formatDateTime(row.inTime) }}</template>
              </el-table-column>
              <el-table-column label="出院时间" align="center" width="140">
                <template #default="{ row }">{{ formatDateTime(row.outTime) }}</template>
              </el-table-column>
              <el-table-column label="住院天数" align="center" width="90">
                <template #default="{ row }">{{ row.days }} 天</template>
              </el-table-column>
              <el-table-column label="预计费用" align="right" width="110">
                <template #default="{ row }">{{ formatMoney(row.fee) }}</template>
              </el-table-column>
              <el-table-column label="状态" align="center" width="90" fixed="right">
                <template #default="{ row }">
                  <el-tag :type="row.outTime ? 'info' : 'success'" size="small">
                    {{ row.outTime ? '已出院' : '在院' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane :label="`治疗记录（${detail.treats.length}）`" name="treats">
            <el-table :data="detail.treats" size="small" stripe>
              <el-table-column label="治疗时间" align="center" width="140">
                <template #default="{ row }">{{ formatDateTime(row.treatTime) }}</template>
              </el-table-column>
              <el-table-column label="主治医生" prop="docName" align="center" width="100" />
              <el-table-column label="科室" prop="dept" align="center" width="90" />
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
import * as PatientApi from '@/api/hospital/patient'
import type { PatientDetailVO } from '@/api/hospital/types'
import { genderLabel } from '../constants'
import { formatDateTime, formatMoney } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalPatientDetail' })

const { reportError } = useHospitalFeedback()

const visible = ref(false)
const loading = ref(false)
const detail = ref<PatientDetailVO>()
const activeTab = ref('records')

const open = async (patientId: number) => {
  visible.value = true
  loading.value = true
  detail.value = undefined
  activeTab.value = 'records'
  try {
    detail.value = await PatientApi.getPatientDetail(patientId)
  } catch (error) {
    reportError(error)
  } finally {
    loading.value = false
  }
}
defineExpose({ open })
</script>