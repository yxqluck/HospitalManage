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
      <el-form-item label="医生编号" prop="docId">
        <el-input
          v-model="queryParams.docId"
          placeholder="请输入医生编号"
          clearable
          class="!w-170px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医生姓名" prop="docName">
        <el-input
          v-model="queryParams.docName"
          placeholder="请输入医生姓名"
          clearable
          class="!w-170px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属科室" prop="dept">
        <el-select v-model="queryParams.dept" placeholder="全部科室" clearable class="!w-170px">
          <el-option
            v-for="item in DEPT_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-select v-model="queryParams.title" placeholder="全部职称" clearable class="!w-170px">
          <el-option
            v-for="item in TITLE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-140px">
          <el-option
            v-for="item in DOCTOR_STATUS_OPTIONS"
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
          <Icon icon="ep:plus" class="mr-5px" /> 新增医生
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column label="医生编号" align="center" prop="docId" width="110" />
      <el-table-column label="姓名" align="center" prop="docName" width="100" />
      <el-table-column label="性别" align="center" width="70">
        <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
      </el-table-column>
      <el-table-column label="职称" align="center" prop="title" width="130" />
      <el-table-column label="所属科室" align="center" prop="dept" width="110" />
      <el-table-column label="联系电话" align="center" prop="phone" width="130" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="DOCTOR_STATUS_CONFIG[row.status]?.type">
            {{ DOCTOR_STATUS_CONFIG[row.status]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button link type="primary" @click="openForm('update', row.docId)">编辑</el-button>
          <el-button
            link
            :type="row.status === 0 ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 0 ? '停用' : '启用' }}
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

  <DoctorForm ref="formRef" @success="getList" />
  <DoctorDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import * as DoctorApi from '@/api/hospital/doctor'
import type { DoctorPageReq, DoctorVO } from '@/api/hospital/types'
import {
  DEPT_OPTIONS,
  DOCTOR_STATUS_CONFIG,
  DOCTOR_STATUS_OPTIONS,
  TITLE_OPTIONS,
  genderLabel
} from '../constants'
import { useHospitalFeedback } from '../useHospitalFeedback'
import DoctorForm from './DoctorForm.vue'
import DoctorDetail from './DoctorDetail.vue'

defineOptions({ name: 'HospitalDoctor' })

const { message, reportError, confirm, delConfirm } = useHospitalFeedback()

const loading = ref(true)
const total = ref(0)
const list = ref<DoctorVO[]>([])
const queryParams = reactive<DoctorPageReq>({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await DoctorApi.getDoctorPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    reportError(error, '查询医生列表失败')
  } finally {
    loading.value = false
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
const openForm = (type: string, docId?: number) => {
  formRef.value?.open(type, docId)
}

const detailRef = ref()
const handleDetail = (row: DoctorVO) => {
  detailRef.value?.open(row.docId)
}

/** 停用 / 启用 */
const handleToggleStatus = async (row: DoctorVO) => {
  const nextStatus = row.status === 0 ? 1 : 0
  const action = nextStatus === 1 ? '停用' : '启用'
  if (!(await confirm(`确定要${action}医生 ${row.docName} 吗？停用后不能新增治疗记录。`))) return
  try {
    await DoctorApi.updateDoctorStatus(row.docId, nextStatus)
    message.success(`${action}成功`)
    await getList()
  } catch (error) {
    reportError(error)
  }
}

/** 删除 */
const handleDelete = async (row: DoctorVO) => {
  if (!(await delConfirm(`确定删除医生 ${row.docName}（${row.docId}）吗？`))) return
  try {
    await DoctorApi.deleteDoctor(row.docId)
    message.success('删除成功')
    await getList()
  } catch (error) {
    reportError(error)
  }
}

onMounted(() => {
  getList()
})
</script>