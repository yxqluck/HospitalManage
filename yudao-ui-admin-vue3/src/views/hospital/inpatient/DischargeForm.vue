<template>
  <Dialog v-model="dialogVisible" title="出院办理" width="560px">
    <el-descriptions :column="2" border class="mb-15px">
      <el-descriptions-item label="住院号">{{ record?.inhId }}</el-descriptions-item>
      <el-descriptions-item label="病人">
        {{ record?.patientName }}（{{ record?.patientId }}）
      </el-descriptions-item>
      <el-descriptions-item label="病房 / 床位">
        {{ record?.roomId }} / {{ record?.bedNo }} 床
      </el-descriptions-item>
      <el-descriptions-item label="科室">{{ record?.dept }}</el-descriptions-item>
      <el-descriptions-item label="入院时间">
        {{ formatDateTime(record?.inTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="已住院">
        {{ record?.days }} 天（预计 {{ formatMoney(record?.fee) }}）
      </el-descriptions-item>
    </el-descriptions>

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="96px">
      <el-form-item label="出院时间" prop="outTime">
        <el-date-picker
          v-model="formData.outTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择出院时间"
          class="!w-full"
        />
      </el-form-item>
    </el-form>

    <el-alert
      type="success"
      :closable="false"
      show-icon
      title="出院后：床位自动释放为「空闲」，病人档案的当前病房清空"
    />

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确认出院</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import * as RecordApi from '@/api/hospital/record-inh'
import type { RecordInhVO } from '@/api/hospital/types'
import { formatDateTime, formatMoney, nowDateTime } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalDischargeForm' })

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const formLoading = ref(false)
const record = ref<RecordInhVO>()
const formData = ref({ outTime: nowDateTime() })
const formRef = ref()

const formRules = reactive<FormRules>({
  outTime: [{ required: true, message: '请选择出院时间', trigger: 'change' }]
})

/** 打开弹窗 */
const open = (row: RecordInhVO) => {
  record.value = row
  formData.value = { outTime: nowDateTime() }
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}
defineExpose({ open })

/** 提交出院 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!record.value) return
  if (record.value.inTime && formData.value.outTime < record.value.inTime) {
    // 字符串格式统一为 YYYY-MM-DD HH:mm:ss，可直接比较
    message.error('出院时间不能早于入院时间')
    return
  }
  formLoading.value = true
  try {
    await RecordApi.dischargeRecord(record.value.inhId, formData.value.outTime)
    message.success('出院办理成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    reportError(error)
  } finally {
    formLoading.value = false
  }
}
</script>