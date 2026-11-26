<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="病案号" prop="patientId">
        <el-input-number
          v-model="formData.patientId"
          :min="1"
          :controls="false"
          :disabled="formType === 'update'"
          placeholder="请输入唯一的病案号"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="病人姓名" prop="patientName">
        <el-input v-model="formData.patientName" placeholder="请输入病人姓名" maxlength="20" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio v-for="item in GENDER_OPTIONS" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" maxlength="11" />
      </el-form-item>
      <el-form-item label="家庭地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入家庭地址" maxlength="100" />
      </el-form-item>
      <el-form-item label="当前病房" prop="roomId">
        <el-select
          v-model="formData.roomId"
          placeholder="未住院可留空"
          clearable
          filterable
          :disabled="inHospital"
          class="!w-full"
        >
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.dept} · ${room.location}）`"
            :value="room.roomId"
            :disabled="room.status === 1"
          />
        </el-select>
        <div class="w-full text-12px text-[var(--el-text-color-secondary)]">
          {{
            inHospital
              ? '病人当前在院，病房 / 床位由住院记录维护，请通过「换床」调整'
              : '可留空；正式入院后由「入院登记」自动维护'
          }}
        </div>
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
import * as PatientApi from '@/api/hospital/patient'
import type { PatientVO, RoomVO } from '@/api/hospital/types'
import { GENDER_OPTIONS } from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalPatientForm' })

const props = defineProps<{
  roomOptions: RoomVO[]
}>()

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const inHospital = ref(false)

interface PatientFormData {
  patientId?: number
  patientName?: string
  gender: number
  phone?: string
  address?: string
  roomId?: number
}

const defaultFormData = (): PatientFormData => ({
  patientId: undefined,
  patientName: '',
  gender: 1,
  phone: '',
  address: '',
  roomId: undefined
})

const formData = ref<PatientFormData>(defaultFormData())
const formRef = ref()

const formRules = reactive<FormRules>({
  patientId: [{ required: true, message: '请输入病案号', trigger: 'change' }],
  patientName: [{ required: true, message: '请输入病人姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^\d{7,11}$/, message: '请输入 7 ~ 11 位数字联系电话', trigger: 'blur' }
  ]
})

/** 打开弹窗 */
const open = async (type: string, patientId?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '建立病人档案' : '编辑病人档案'
  inHospital.value = false
  resetForm()
  if (type === 'update' && patientId) {
    formLoading.value = true
    try {
      const patient = await PatientApi.getPatient(patientId)
      formData.value = {
        patientId: patient.patientId,
        patientName: patient.patientName,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        roomId: patient.roomId
      }
      inHospital.value = !!patient.inHospital
    } catch (error) {
      reportError(error)
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as unknown as PatientVO
    if (formType.value === 'create') {
      await PatientApi.createPatient(data)
      message.success('建档成功')
    } else {
      await PatientApi.updatePatient(data)
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