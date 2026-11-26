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
      <el-form-item label="病房编号" prop="roomId">
        <el-input
          v-model="queryParams.roomId"
          placeholder="请输入病房编号"
          clearable
          class="!w-200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属科室" prop="dept">
        <el-select v-model="queryParams.dept" placeholder="全部科室" clearable class="!w-200px">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地点" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入地点关键字"
          clearable
          class="!w-200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-160px">
          <el-option
            v-for="item in ROOM_STATUS_OPTIONS"
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
          <Icon icon="ep:plus" class="mr-5px" /> 新增病房
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="病房编号" align="center" prop="roomId" width="110" />
      <el-table-column label="所属科室" align="center" prop="dept" width="110" />
      <el-table-column label="地点" align="left" prop="location" min-width="180">
        <template #default="{ row }">
          <span class="flex items-center">
            <Icon icon="ep:location" class="mr-5px text-[var(--el-color-primary)]" />
            {{ row.location }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收费标准" align="right" prop="fee" width="130">
        <template #default="{ row }">
          <span class="text-[var(--el-color-danger)]">{{ formatMoney(row.fee) }}</span>
          <span class="text-12px text-[var(--el-text-color-secondary)]">/天</span>
        </template>
      </el-table-column>
      <el-table-column label="床位情况" align="center" width="230">
        <template #default="{ row }">
          <span>共 {{ row.bedCount ?? 0 }} 张</span>
          <el-tag type="success" size="small" class="mx-5px">空闲 {{ row.freeBedCount ?? 0 }}</el-tag>
          <el-tag type="warning" size="small">占用 {{ row.occupiedBedCount ?? 0 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="ROOM_STATUS_CONFIG[row.status]?.type">
            {{ ROOM_STATUS_CONFIG[row.status]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button link type="primary" @click="openForm('update', row.roomId)">编辑</el-button>
          <el-button
            link
            :type="row.status === 0 ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 0 ? '禁用' : '启用' }}
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

  <!-- 表单弹窗：新增 / 修改 -->
  <RoomForm ref="formRef" @success="getList" />

  <!-- 病房详情：床位清单 + 当前在住病人 -->
  <el-drawer v-model="detailVisible" title="病房详情" size="680px">
    <div v-loading="detailLoading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="病房编号">{{ detail?.room.roomId }}</el-descriptions-item>
        <el-descriptions-item label="所属科室">{{ detail?.room.dept }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ detail?.room.location }}</el-descriptions-item>
        <el-descriptions-item label="收费标准">
          {{ formatMoney(detail?.room.fee) }} / 天
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="ROOM_STATUS_CONFIG[detail?.room.status ?? 0]?.type">
            {{ ROOM_STATUS_CONFIG[detail?.room.status ?? 0]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="床位统计">
          <el-tag type="success" size="small">空闲 {{ detail?.room.freeBedCount ?? 0 }}</el-tag>
          <el-tag type="warning" size="small" class="mx-5px">
            占用 {{ detail?.room.occupiedBedCount ?? 0 }}
          </el-tag>
          <el-tag type="info" size="small">维修 {{ detail?.room.repairBedCount ?? 0 }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="mb-10px mt-20px text-15px font-700">床位清单</div>
      <el-table :data="detail?.beds ?? []" size="small" stripe>
        <el-table-column label="床位编号" prop="bedId" align="center" width="90" />
        <el-table-column label="床位号" align="center" width="80">
          <template #default="{ row }">{{ row.bedNo }} 床</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="BED_STATUS_CONFIG[row.bedStatus]?.type" size="small">
              {{ BED_STATUS_CONFIG[row.bedStatus]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前病人" align="center" min-width="120">
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
      </el-table>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import * as RoomApi from '@/api/hospital/room'
import type { RoomDetailVO, RoomPageReq, RoomVO } from '@/api/hospital/types'
import {
  BED_STATUS_CONFIG,
  DEPT_OPTIONS,
  ROOM_STATUS_CONFIG,
  ROOM_STATUS_OPTIONS
} from '../constants'
import { formatMoney } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'
import RoomForm from './RoomForm.vue'

defineOptions({ name: 'HospitalRoom' })

const { message, reportError, confirm, delConfirm } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<RoomVO[]>([])
const queryParams = reactive<RoomPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

/** 查询病房列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RoomApi.getRoomPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询病房列表失败')
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 新增 / 修改 */
const formRef = ref()
const openForm = (type: string, roomId?: number) => {
  formRef.value?.open(type, roomId)
}

/** 启用 / 禁用 */
const handleToggleStatus = async (row: RoomVO) => {
  const nextStatus = row.status === 0 ? 1 : 0
  const action = nextStatus === 1 ? '禁用' : '启用'
  if (!(await confirm(`确定要${action}病房 ${row.roomId} 吗？`))) return
  try {
    await RoomApi.updateRoomStatus(row.roomId, nextStatus)
    message.success(`${action}成功`)
    await getList()
  } catch (error) {
    reportError(error)
  }
}

/** 删除 */
const handleDelete = async (row: RoomVO) => {
  if (!(await delConfirm(`确定删除病房 ${row.roomId} 吗？`))) return
  try {
    await RoomApi.deleteRoom(row.roomId)
    message.success('删除成功')
    await getList()
  } catch (error) {
    reportError(error)
  }
}

/** 详情抽屉 */
const detailVisible = ref(false)
const detailLoading = ref(false)
const detail = ref<RoomDetailVO>()
const handleDetail = async (row: RoomVO) => {
  detailVisible.value = true
  detailLoading.value = true
  detail.value = undefined
  try {
    detail.value = await RoomApi.getRoomDetail(row.roomId)
  } catch (error) {
    reportError(error)
  } finally {
    detailLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>