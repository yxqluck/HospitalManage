<template>
  <el-drawer v-model="visible" title="住院详情" size="820px">
    <div v-loading="loading">
      <template v-if="record">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="住院号">{{ record.inhId }}</el-descriptions-item>
          <el-descriptions-item label="病案号">{{ record.patientId }}</el-descriptions-item>
          <el-descriptions-item label="病人姓名">{{ record.patientName }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ genderLabel(record.gender) }}</el-descriptions-item>
          <el-descriptions-item label="科室">{{ record.dept }}</el-descriptions-item>
          <el-descriptions-item label="病房 / 床位">
            {{ record.roomId }} / {{ record.bedNo }} 床
          </el-descriptions-item>
          <el-descriptions-item label="登记日期">
            {{ formatDateTime(record.recordDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="入院时间">
            {{ formatDateTime(record.inTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="出院时间">
            {{ record.outTime ? formatDateTime(record.outTime) : '在院中' }}
          </el-descriptions-item>
          <el-descriptions-item label="住院天数">{{ record.days }} 天</el-descriptions-item>
          <el-descriptions-item label="预计费用">{{ formatMoney(record.fee) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="record.outTime ? 'info' : 'success'">
              {{ record.outTime ? '已出院' : '在院' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="mb-10px mt-20px flex items-center justify-between">
          <span class="text-15px font-700">本次住院治疗记录（{{ treats.length }}）</span>
          <span class="text-12px text-[var(--el-text-color-secondary)]">
            主治医生：{{ record.docName || '-' }}
          </span>
        </div>
        <el-table :data="treats" size="small" stripe>
          <el-table-column label="治疗时间" align="center" width="150">
            <template #default="{ row }">{{ formatDateTime(row.treatTime) }}</template>
          </el-table-column>
          <el-table-column label="医生" prop="docName" align="center" width="100" />
          <el-table-column label="诊断" prop="diagnosis" min-width="170" show-overflow-tooltip />
          <el-table-column label="治疗方案" prop="plan" min-width="260" show-overflow-tooltip />
        </el-table>
      </template>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import * as RecordApi from '@/api/hospital/record-inh'
import type { RecordInhVO, RecordTreatVO } from '@/api/hospital/types'
import { genderLabel } from '../constants'
import { formatDateTime, formatMoney } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalInpatientDetail' })

const { reportError } = useHospitalFeedback()

const visible = ref(false)
const loading = ref(false)
const record = ref<RecordInhVO>()
const treats = ref<RecordTreatVO[]>([])

const open = async (inhId: number) => {
  visible.value = true
  loading.value = true
  record.value = undefined
  treats.value = []
  try {
    const data = await RecordApi.getRecord(inhId)
    record.value = data.record
    treats.value = data.treats
  } catch (error) {
    reportError(error)
  } finally {
    loading.value = false
  }
}
defineExpose({ open })
</script>