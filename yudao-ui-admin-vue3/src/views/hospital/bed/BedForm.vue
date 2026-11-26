<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="所属病房" prop="roomId">
        <el-select v-model="formData.roomId" placeholder="请选择病房" filterable class="!w-full">
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.dept} · ${room.location}）`"
            :value="room.roomId"
            :disabled="room.status === 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="床位号" prop="bedNo">
        <el-input-number
          v-model="formData.bedNo"
          :min="1"
          :controls="false"
          placeholder="请输入床位号"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="床位状态" prop="bedStatus">
        <el-radio-group v-model="formData.bedStatus" :disabled="occupied">
          <el-radio v-for="item in manualStatusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
        <div class="w-full text-12px text-[var(--el-text-color-secondary)]">
          <template v-if="occupied">
            该床位当前有在院病人，「占用」状态由入院 / 出院流程自动维护
          </template>
          <template v-else>
            「占用」状态由入院登记自动维护，这里只需维护空闲 / 维修停用
          </template>
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
import * as BedApi from '@/api/hospital/bed'
import type { BedVO, RoomVO } from '@/api/hospital/types'
import { BED_STATUS_FREE, BED_STATUS_OCCUPIED, BED_STATUS_OPTIONS } from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalBedForm' })

const props = defineProps<{
  roomOptions: RoomVO[]
}>()

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const occupied = ref(false)

/** 手工可维护的状态（“占用”由业务流程维护） */
const manualStatusOptions = BED_STATUS_OPTIONS.filter(
  (item) => item.value !== BED_STATUS_OCCUPIED
)

interface BedFormData {
  bedId?: number
  roomId?: number
  bedNo?: number
  bedStatus: number
}

const defaultFormData = (): BedFormData => ({
  bedId: undefined,
  roomId: undefined,
  bedNo: undefined,
  bedStatus: BED_STATUS_FREE
})

const formData = ref<BedFormData>(defaultFormData())
const formRef = ref()

const formRules = reactive<FormRules>({
  roomId: [{ required: true, message: '请选择所属病房', trigger: 'change' }],
  bedNo: [{ required: true, message: '请输入床位号', trigger: 'change' }],
  bedStatus: [{ required: true, message: '请选择床位状态', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, bedId?: number) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '新增病床' : '编辑病床'
  occupied.value = false
  resetForm()
  if (type === 'update' && bedId) {
    formLoading.value = true
    try {
      const bed = await BedApi.getBed(bedId)
      formData.value = {
        bedId: bed.bedId,
        roomId: bed.roomId,
        bedNo: bed.bedNo,
        bedStatus: bed.bedStatus
      }
      occupied.value = bed.bedStatus === BED_STATUS_OCCUPIED
    } catch (error) {
      reportError(error)
    } finally {
      formLoading.value = false
    }
  } else if (type === 'create') {
    // 默认选中第一个启用中的病房，减少一次点击
    const firstRoom = props.roomOptions.find((room) => room.status === 0)
    if (firstRoom) formData.value.roomId = firstRoom.roomId
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
    const data = formData.value as unknown as BedVO
    if (formType.value === 'create') {
      await BedApi.createBed(data)
      message.success('新增成功')
    } else {
      await BedApi.updateBed(data)
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

<style scoped>
/* 保证“维修停用”单选文案完整显示 */
:deep(.el-radio) {
  margin-right: 18px;
}
</style>