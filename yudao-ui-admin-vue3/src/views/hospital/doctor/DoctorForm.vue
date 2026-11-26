<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="医生编号" prop="docId">
        <el-input-number
          v-model="formData.docId"
          :min="1"
          :controls="false"
          :disabled="formType === 'update'"
          placeholder="请输入唯一的医生编号"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="医生姓名" prop="docName">
        <el-input v-model="formData.docName" placeholder="请输入医生姓名" maxlength="20" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio v-for="item in GENDER_OPTIONS" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-select v-model="formData.title" placeholder="请选择职称" class="!w-full">
          <el-option
            v-for="item in TITLE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="dept">
        <el-select v-model="formData.dept" placeholder="请选择科室" class="!w-full">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" maxlength="11" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="item in DOCTOR_STATUS_OPTIONS" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
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
import * as DoctorApi from '@/api/hospital/doctor'
import type { DoctorVO } from '@/api/hospital/types'
import {
  DEPT_OPTIONS,
  DOCTOR_STATUS_OPTIONS,
  GENDER_OPTIONS,
  TITLE_OPTIONS
} from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalDoctorForm' })

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')

interface DoctorFormData {
  docId?: number
  docName?: string
  gender: number
  title?: string
  phone?: string
  dept?: string
  status: number
}

const defaultFormData = (): DoctorFormData => ({
  docId: undefined,
  docName: '',
  gender: 1,
  title: '主治医师',
  phone: '',
  dept: '内科',
  status: 0
})

const formData = ref<DoctorFormData>(defaultFormData())
const formRef = ref()

const formRules = reactive<FormRules>({
  docId: [{ required: true, message: '请输入医生编号', trigger: 'change' }],
  docName: [{ required: true, message: '请输入医生姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  title: [{ required: true, message: '请选择职称', trigger: 'change' }],
  dept: [{ required: true, message: '请选择所属科室', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^\d{7,11}$/, message: '请输入 7 ~ 11 位数字联系电话', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, docId?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '新增医生' : '编辑医生'
  resetForm()
  if (type === 'update' && docId) {
    formLoading.value = true
    try {
      const doctor = await DoctorApi.getDoctor(docId)
      formData.value = { ...doctor }
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
    const data = formData.value as unknown as DoctorVO
    if (formType.value === 'create') {
      await DoctorApi.createDoctor(data)
      message.success('新增成功')
    } else {
      await DoctorApi.updateDoctor(data)
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