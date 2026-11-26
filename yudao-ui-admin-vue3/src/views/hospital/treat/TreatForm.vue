<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="680px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="病案号" prop="patientId">
        <el-select v-model="formData.patientId" placeholder="请选择病人" filterable class="!w-full">
          <el-option
            v-for="patient in patientOptions"
            :key="patient.patientId"
            :label="`${patient.patientId} ${patient.patientName}（${genderLabel(patient.gender)}）`"
            :value="patient.patientId"
          />
        </el-select>
        <div class="w-full text-12px text-[var(--el-text-color-secondary)]">
          <template v-if="selectedPatient?.inHospital">
            该病人当前在院（病房 {{ selectedPatient.roomId }}），本次治疗可视为住院治疗
          </template>
          <template v-else> 未在院病人可视为门诊治疗，治疗记录会保留在病人档案中 </template>
        </div>
      </el-form-item>
      <el-form-item label="主治医生" prop="docId">
        <el-select v-model="formData.docId" placeholder="请选择医生" filterable class="!w-full">
          <el-option
            v-for="doctor in doctorOptions"
            :key="doctor.docId"
            :label="`${doctor.docName}（${doctor.title} · ${doctor.dept}）`"
            :value="doctor.docId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗时间" prop="treatTime">
        <el-date-picker
          v-model="formData.treatTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择治疗时间"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="诊断" prop="diagnosis">
        <el-input
          v-model="formData.diagnosis"
          type="textarea"
          :rows="3"
          maxlength="500"
          show-word-limit
          placeholder="请输入诊断结果"
        />
      </el-form-item>
      <el-form-item label="治疗方案" prop="plan">
        <el-input
          v-model="formData.plan"
          type="textarea"
          :rows="4"
          maxlength="1000"
          show-word-limit
          placeholder="请输入治疗方案，如用药、手术、护理要点等"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import * as TreatApi from '@/api/hospital/record-treat'
import * as DoctorApi from '@/api/hospital/doctor'
import * as PatientApi from '@/api/hospital/patient'
import type { DoctorVO, PatientVO, RecordTreatVO } from '@/api/hospital/types'
import { genderLabel } from '../constants'
import { nowDateTime } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalTreatForm' })

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const patientOptions = ref<PatientVO[]>([])
const doctorOptions = ref<DoctorVO[]>([])

interface TreatFormData {
  treatId?: number
  patientId?: number
  docId?: number
  treatTime: string
  diagnosis: string
  plan: string
}

const defaultFormData = (): TreatFormData => ({
  treatId: undefined,
  patientId: undefined,
  docId: undefined,
  treatTime: nowDateTime(),
  diagnosis: '',
  plan: ''
})

const formData = ref<TreatFormData>(defaultFormData())
const formRef = ref()

const selectedPatient = computed(() =>
  patientOptions.value.find((item) => item.patientId === formData.value.patientId)
)

const formRules = reactive<FormRules>({
  patientId: [{ required: true, message: '请选择病人', trigger: 'change' }],
  docId: [{ required: true, message: '请选择医生', trigger: 'change' }],
  treatTime: [{ required: true, message: '请选择治疗时间', trigger: 'change' }],
  diagnosis: [{ required: true, message: '请输入诊断', trigger: 'blur' }],
  plan: [{ required: true, message: '请输入治疗方案', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, treatId?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '新增治疗记录' : '编辑治疗记录'
  resetForm()
  formLoading.value = true
  try {
    const [patients, doctors] = await Promise.all([
      PatientApi.getPatientList(),
      DoctorApi.getDoctorList(0)
    ])
    patientOptions.value = patients
    doctorOptions.value = doctors
    if (type === 'update' && treatId) {
      const treat = await TreatApi.getTreat(treatId)
      formData.value = {
        treatId: treat.treatId,
        patientId: treat.patientId,
        docId: treat.docId,
        treatTime: treat.treatTime,
        diagnosis: treat.diagnosis,
        plan: treat.plan
      }
    }
  } catch (error) {
    reportError(error)
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  formLoading.value = true
  try {
    const data = formData.value as unknown as RecordTreatVO
    if (formType.value === 'create') {
      await TreatApi.createTreat(data)
      message.success('新增成功')
    } else {
      await TreatApi.updateTreat(data)
      message.success('修改成功')
    }
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    reportError(error)
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = defaultFormData()
  nextTick(() => formRef.value?.clearValidate())
}
</script>