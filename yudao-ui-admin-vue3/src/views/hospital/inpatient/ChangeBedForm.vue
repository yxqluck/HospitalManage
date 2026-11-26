<template>
  <Dialog v-model="dialogVisible" title="床位调度（换床）" width="600px">
    <el-descriptions :column="2" border class="mb-15px">
      <el-descriptions-item label="病人">
        {{ record?.patientName }}（{{ record?.patientId }}）
      </el-descriptions-item>
      <el-descriptions-item label="当前床位">
        {{ record?.roomId }} 病房 / {{ record?.bedNo }} 床（{{ record?.dept }}）
      </el-descriptions-item>
    </el-descriptions>

    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="新病房" prop="roomId">
        <el-select
          v-model="formData.roomId"
          placeholder="请选择病房"
          filterable
          class="!w-full"
          @change="handleRoomChange"
        >
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.dept} · ${room.location}）`"
            :value="room.roomId"
            :disabled="room.status === 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="新床位" prop="bedId">
        <el-select
          v-model="formData.bedId"
          :placeholder="formData.roomId ? '请选择空闲床位' : '请先选择病房'"
          :loading="bedLoading"
          :disabled="!formData.roomId"
          class="!w-full"
        >
          <el-option
            v-for="bed in bedOptions"
            :key="bed.bedId"
            :label="`${bed.bedNo} 床（床位编号 ${bed.bedId}）`"
            :value="bed.bedId"
          />
        </el-select>
        <div
          v-if="formData.roomId && !bedLoading && bedOptions.length === 0"
          class="w-full text-12px text-[var(--el-color-danger)]"
        >
          该病房暂无空闲床位，请选择其他病房
        </div>
      </el-form-item>
    </el-form>

    <el-alert
      type="warning"
      :closable="false"
      show-icon
      title="换床后：旧床位释放为「空闲」，新床位改为「占用」，住院记录与病人档案同步更新"
    />

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确认换床</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import * as RecordApi from '@/api/hospital/record-inh'
import * as BedApi from '@/api/hospital/bed'
import type { BedVO, RecordInhVO, RoomVO } from '@/api/hospital/types'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalChangeBedForm' })

defineProps<{
  roomOptions: RoomVO[]
}>()

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const formLoading = ref(false)
const bedLoading = ref(false)
const record = ref<RecordInhVO>()
const bedOptions = ref<BedVO[]>([])
const formData = ref<{ roomId?: number; bedId?: number }>({ roomId: undefined, bedId: undefined })
const formRef = ref()

const formRules = reactive<FormRules>({
  roomId: [{ required: true, message: '请选择病房', trigger: 'change' }],
  bedId: [{ required: true, message: '请选择床位', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (row: RecordInhVO) => {
  record.value = row
  dialogVisible.value = true
  formData.value = { roomId: row.roomId, bedId: undefined }
  formRef.value?.clearValidate()
  await loadBeds(row.roomId)
}
defineExpose({ open })

/** 加载空闲床位 */
const loadBeds = async (roomId?: number) => {
  formData.value.bedId = undefined
  bedOptions.value = []
  if (!roomId) return
  bedLoading.value = true
  try {
    bedOptions.value = await BedApi.getBedList({ roomId, bedStatus: 0 })
  } catch (error) {
    reportError(error, '查询空闲床位失败')
  } finally {
    bedLoading.value = false
  }
}
/** 切换病房时重新加载空闲床位 */
const handleRoomChange = (roomId: number) => {
  loadBeds(roomId)
}

/** 提交换床 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!record.value) return
  formLoading.value = true
  try {
    await RecordApi.changeRecordBed({
      inhId: record.value.inhId,
      roomId: formData.value.roomId as number,
      bedId: formData.value.bedId as number
    })
    message.success('换床成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    reportError(error)
  } finally {
    formLoading.value = false
  }
}
</script>