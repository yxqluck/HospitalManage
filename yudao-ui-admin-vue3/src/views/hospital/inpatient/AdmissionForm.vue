<template>
  <Dialog v-model="dialogVisible" title="入院登记" width="640px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="96px"
    >
      <el-form-item label="病案号" prop="patientId">
        <el-select
          v-model="formData.patientId"
          placeholder="请选择病人"
          filterable
          class="!w-full"
        >
          <el-option
            v-for="patient in patientOptions"
            :key="patient.patientId"
            :label="`${patient.patientId} ${patient.patientName}（${genderLabel(patient.gender)}）`"
            :value="patient.patientId"
          />
        </el-select>
      </el-form-item>

      <el-alert
        v-if="patientInHospital"
        type="warning"
        :closable="false"
        show-icon
        class="mb-15px"
        title="该病人当前已在院，不能重复登记入院"
      />
      <el-alert
        v-else-if="selectedPatient"
        type="info"
        :closable="false"
        show-icon
        class="mb-15px"
        :title="patientAlertTitle"
      />

      <el-form-item label="病房" prop="roomId">
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
      <el-form-item label="床位" prop="bedId">
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
          该病房暂无空闲床位，请更换病房或先办理出院 / 恢复维修床位
        </div>
      </el-form-item>
      <el-form-item label="入院时间" prop="inTime">
        <el-date-picker
          v-model="formData.inTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择入院时间"
          class="!w-full"
        />
      </el-form-item>

      <el-alert
        type="success"
        :closable="false"
        show-icon
        title="入院成功后：床位状态自动改为「占用」，病人档案的当前病房同步更新"
      />
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading || patientInHospital" type="primary" @click="submitForm">
        确认入院
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import * as RecordApi from '@/api/hospital/record-inh'
import * as BedApi from '@/api/hospital/bed'
import * as PatientApi from '@/api/hospital/patient'
import type { BedVO, PatientVO, RoomVO } from '@/api/hospital/types'
import { genderLabel } from '../constants'
import { nowDateTime } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalAdmissionForm' })

defineProps<{
  roomOptions: RoomVO[]
}>()

const { message, reportError } = useHospitalFeedback()

const dialogVisible = ref(false)
const formLoading = ref(false)
const bedLoading = ref(false)
const patientOptions = ref<PatientVO[]>([])
const bedOptions = ref<BedVO[]>([])

const formData = ref<{
  patientId?: number
  roomId?: number
  bedId?: number
  inTime: string
}>({
  patientId: undefined,
  roomId: undefined,
  bedId: undefined,
  inTime: nowDateTime()
})
const formRef = ref()

const selectedPatient = computed(() =>
  patientOptions.value.find((item) => item.patientId === formData.value.patientId)
)
const patientInHospital = computed(() => !!selectedPatient.value?.inHospital)

const patientAlertTitle = computed(() => {
  const patient = selectedPatient.value
  if (!patient) return ''
  const room = patient.roomId ? `，当前登记病房：${patient.roomId}` : ''
  return `病人：${patient.patientName}，电话：${patient.phone}${room}`
})

const formRules = reactive<FormRules>({
  patientId: [{ required: true, message: '请选择病人', trigger: 'change' }],
  roomId: [{ required: true, message: '请选择病房', trigger: 'change' }],
  bedId: [{ required: true, message: '请选择床位', trigger: 'change' }],
  inTime: [{ required: true, message: '请选择入院时间', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  formData.value = { patientId: undefined, roomId: undefined, bedId: undefined, inTime: nowDateTime() }
  bedOptions.value = []
  formRef.value?.clearValidate()
  try {
    patientOptions.value = await PatientApi.getPatientList()
  } catch (error) {
    reportError(error, '查询病人列表失败')
  }
}
defineExpose({ open })

/** 选择病房后加载空闲床位 */
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
watch(() => formData.value.roomId, (roomId) => loadBeds(roomId))

/** 提交入院登记 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  formLoading.value = true
  try {
    await RecordApi.createRecord({
      patientId: formData.value.patientId as number,
      roomId: formData.value.roomId as number,
      bedId: formData.value.bedId as number,
      inTime: formData.value.inTime
    })
    message.success('入院登记成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    reportError(error)
  } finally {
    formLoading.value = false
  }
}
</script>