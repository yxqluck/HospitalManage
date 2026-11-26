<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="病房编号" prop="roomId">
        <el-input-number
          v-model="formData.roomId"
          :min="1"
          :controls="false"
          :disabled="formType === 'update'"
          placeholder="请输入唯一的病房编号"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="所属科室" prop="dept">
        <el-select v-model="formData.dept" placeholder="请选择所属科室" class="!w-full">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="病房地点" prop="location">
        <el-input v-model="formData.location" placeholder="如：1号楼 3层 301" maxlength="100" />
      </el-form-item>
      <el-form-item label="收费标准" prop="fee">
        <el-input-number
          v-model="formData.fee"
          :min="0"
          :precision="2"
          :step="10"
          class="!w-full"
        />
        <span class="ml-10px text-12px text-[var(--el-text-color-secondary)]">元 / 天</span>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="item in ROOM_STATUS_OPTIONS" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
        <div class="w-full text-12px text-[var(--el-text-color-secondary)]">
          禁用后不能再给该病房分配床位，历史数据不受影响
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
import * as RoomApi from '@/api/hospital/room'
import type { RoomVO } from '@/api/hospital/types'
import { DEPT_OPTIONS, ROOM_STATUS_OPTIONS } from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalRoomForm' })

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
/** create - 新增；update - 修改 */
const formType = ref('')

interface RoomFormData {
  roomId?: number
  dept?: string
  location?: string
  fee?: number
  status: number
}

const defaultFormData = (): RoomFormData => ({
  roomId: undefined,
  dept: '内科',
  location: '',
  fee: 120,
  status: 0
})

const formData = ref<RoomFormData>(defaultFormData())
const formRef = ref()

const formRules = reactive<FormRules>({
  roomId: [{ required: true, message: '请输入病房编号', trigger: 'change' }],
  dept: [{ required: true, message: '请选择所属科室', trigger: 'change' }],
  location: [{ required: true, message: '请输入病房地点', trigger: 'blur' }],
  fee: [{ required: true, message: '请输入收费标准', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, roomId?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '新增病房' : '编辑病房'
  resetForm()
  if (type === 'update' && roomId) {
    formLoading.value = true
    try {
      const room = await RoomApi.getRoom(roomId)
      formData.value = {
        roomId: room.roomId,
        dept: room.dept,
        location: room.location,
        fee: room.fee,
        status: room.status
      }
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
    const data = formData.value as unknown as RoomVO
    if (formType.value === 'create') {
      await RoomApi.createRoom(data)
      message.success('新增成功')
    } else {
      await RoomApi.updateRoom(data)
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

/** 重置表单 */
const resetForm = () => {
  formData.value = defaultFormData()
  nextTick(() => formRef.value?.clearValidate())
}
</script>