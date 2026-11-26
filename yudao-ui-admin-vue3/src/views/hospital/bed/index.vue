<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="76px"
    >
      <el-form-item label="所属病房" prop="roomId">
        <el-select v-model="queryParams.roomId" placeholder="全部病房" clearable class="!w-200px">
          <el-option
            v-for="room in roomOptions"
            :key="room.roomId"
            :label="`${room.roomId}（${room.location}）`"
            :value="room.roomId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="dept">
        <el-select v-model="queryParams.dept" placeholder="全部科室" clearable class="!w-180px">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="床位状态" prop="bedStatus">
        <el-select v-model="queryParams.bedStatus" placeholder="全部状态" clearable class="!w-160px">
          <el-option
            v-for="item in BED_STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" /> 新增病床
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="床位编号" align="center" prop="bedId" width="100" />
      <el-table-column label="病房编号" align="center" prop="roomId" width="110" />
      <el-table-column label="所属科室" align="center" prop="dept" width="110" />
      <el-table-column label="病房地点" align="left" prop="location" min-width="170" />
      <el-table-column label="床位号" align="center" width="90">
        <template #default="{ row }">{{ row.bedNo }} 床</template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="110">
        <template #default="{ row }">
          <el-tag :type="BED_STATUS_CONFIG[row.bedStatus]?.type">
            {{ BED_STATUS_CONFIG[row.bedStatus]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前病人" align="center" min-width="140">
        <template #default="{ row }">
          <template v-if="row.patientName">
            {{ row.patientName }}
            <span class="text-12px text-[var(--el-text-color-secondary)]">
              （{{ row.patientId }}）
            </span>
          </template>
          <span v-else class="text-[var(--el-text-color-secondary)]">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.bedStatus !== BED_STATUS_OCCUPIED"
            link
            type="primary"
            @click="openForm('update', row.bedId)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.bedStatus === BED_STATUS_OCCUPIED"
            link
            type="info"
            disabled
            title="占用状态由入院 / 出院流程自动维护"
          >
            占用中
          </el-button>
          <el-button
            v-else
            link
            :type="row.bedStatus === BED_STATUS_REPAIR ? 'success' : 'warning'"
            @click="handleSetStatus(row, row.bedStatus === BED_STATUS_REPAIR ? 0 : 2)"
          >
            {{ row.bedStatus === BED_STATUS_REPAIR ? '恢复空闲' : '维修停用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <BedForm ref="formRef" :room-options="roomOptions" @success="getList" />
</template>

<script lang="ts" setup>
import * as BedApi from '@/api/hospital/bed'
import * as RoomApi from '@/api/hospital/room'
import type { BedPageReq, BedVO, RoomVO } from '@/api/hospital/types'
import {
  BED_STATUS_CONFIG,
  BED_STATUS_OCCUPIED,
  BED_STATUS_OPTIONS,
  BED_STATUS_REPAIR,
  DEPT_OPTIONS
} from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'
import BedForm from './BedForm.vue'

defineOptions({ name: 'HospitalBed' })

const { message, reportError, confirm, delConfirm } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<BedVO[]>([])
const roomOptions = ref<RoomVO[]>([])
const queryParams = reactive<BedPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

/** 查询床位列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BedApi.getBedPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询床位列表失败')
  } finally {
    loading.value = false
  }
}

/** 加载病房下拉数据 */
const loadRooms = async () => {
  try {
    roomOptions.value = await RoomApi.getRoomList()
  } catch (error) {
    reportError(error, '查询病房列表失败')
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, bedId?: number) => {
  formRef.value?.open(type, bedId)
}

/** 维修停用 / 恢复空闲 */
const handleSetStatus = async (row: BedVO, bedStatus: number) => {
  const action = bedStatus === BED_STATUS_REPAIR ? '维修停用' : '恢复空闲'
  if (!(await confirm(`确定将 ${row.roomId} 病房 ${row.bedNo} 床设为「${action}」吗？`))) return
  try {
    await BedApi.updateBedStatus(row.bedId, bedStatus)
    message.success(`${action}成功`)
    await getList()
  } catch (error) {
    reportError(error)
  }
}

/** 删除床位 */
const handleDelete = async (row: BedVO) => {
  if (!(await delConfirm(`确定删除 ${row.roomId} 病房 ${row.bedNo} 床吗？`))) return
  try {
    await BedApi.deleteBed(row.bedId)
    message.success('删除成功')
    await getList()
  } catch (error) {
    reportError(error)
  }
}

onMounted(async () => {
  await loadRooms()
  getList()
})
</script>