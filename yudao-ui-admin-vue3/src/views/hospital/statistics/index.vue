<template>
  <ContentWrap>
    <el-tabs v-model="activeTab">
      <!-- ==================== 在院病人一览 ==================== -->
      <el-tab-pane label="在院病人一览" name="inHospital">
        <div class="mb-15px grid grid-cols-1 gap-15px md:grid-cols-2 xl:grid-cols-4">
          <el-card shadow="never" class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-13px text-[var(--el-text-color-secondary)]">在院病人</div>
                <div class="mt-6px text-26px font-700">
                  {{ overview?.inHospitalCount ?? 0 }}
                  <span class="text-13px font-400">人</span>
                </div>
              </div>
              <Icon icon="ep:user" :size="34" class="text-[var(--el-color-primary)] opacity-60" />
            </div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-13px text-[var(--el-text-color-secondary)]">床位使用率</div>
                <div class="mt-6px text-26px font-700">
                  {{ overview?.bedUsageRate ?? 0 }}
                  <span class="text-13px font-400">%</span>
                </div>
              </div>
              <Icon icon="ep:pie-chart" :size="34" class="text-[var(--el-color-warning)] opacity-60" />
            </div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-13px text-[var(--el-text-color-secondary)]">空闲床位</div>
                <div class="mt-6px text-26px font-700">
                  {{ overview?.bedFree ?? 0 }}
                  <span class="text-13px font-400">张</span>
                </div>
              </div>
              <Icon icon="ep:grid" :size="34" class="text-[var(--el-color-success)] opacity-60" />
            </div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-13px text-[var(--el-text-color-secondary)]">今日新入院</div>
                <div class="mt-6px text-26px font-700">
                  {{ overview?.todayAdmissionCount ?? 0 }}
                  <span class="text-13px font-400">人</span>
                </div>
              </div>
              <Icon icon="ep:calendar" :size="34" class="text-[var(--el-color-danger)] opacity-60" />
            </div>
          </el-card>
        </div>

        <el-table v-loading="inHospitalLoading" :data="inHospitalList" stripe>
          <el-table-column label="科室" align="center" prop="dept" width="90" />
          <el-table-column label="病房" align="center" prop="roomId" width="100" />
          <el-table-column label="床位" align="center" width="80">
            <template #default="{ row }">{{ row.bedNo }} 床</template>
          </el-table-column>
          <el-table-column label="病人" align="left" width="140">
            <template #default="{ row }">
              {{ row.patientName }}
              <span class="text-12px text-[var(--el-text-color-secondary)]">（{{ row.patientId }}）</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" width="70">
            <template #default="{ row }">{{ genderLabel(row.gender) }}</template>
          </el-table-column>
          <el-table-column label="入院时间" align="center" width="150">
            <template #default="{ row }">{{ formatDateTime(row.inTime) }}</template>
          </el-table-column>
          <el-table-column label="已住院" align="center" width="90">
            <template #default="{ row }">{{ row.days }} 天</template>
          </el-table-column>
          <el-table-column label="主治医生" align="center" width="110">
            <template #default="{ row }">{{ row.docName || '-' }}</template>
          </el-table-column>
          <el-table-column label="预计费用" align="right" width="120">
            <template #default="{ row }">{{ formatMoney(row.fee) }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ==================== 床位使用统计 ==================== -->
      <el-tab-pane label="床位使用统计" name="bedUsage">
        <div class="mb-15px grid grid-cols-1 gap-15px md:grid-cols-2 xl:grid-cols-4">
          <el-card shadow="never" class="stat-card">
            <div class="text-13px text-[var(--el-text-color-secondary)]">床位总数</div>
            <div class="mt-6px text-26px font-700">{{ bedSummary.total }} <span class="text-13px font-400">张</span></div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="text-13px text-[var(--el-text-color-secondary)]">占用</div>
            <div class="mt-6px text-26px font-700 text-[var(--el-color-warning)]">
              {{ bedSummary.occupied }} <span class="text-13px font-400">张</span>
            </div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="text-13px text-[var(--el-text-color-secondary)]">空闲</div>
            <div class="mt-6px text-26px font-700 text-[var(--el-color-success)]">
              {{ bedSummary.free }} <span class="text-13px font-400">张</span>
            </div>
          </el-card>
          <el-card shadow="never" class="stat-card">
            <div class="text-13px text-[var(--el-text-color-secondary)]">维修停用</div>
            <div class="mt-6px text-26px font-700 text-[var(--el-text-color-secondary)]">
              {{ bedSummary.repair }} <span class="text-13px font-400">张</span>
            </div>
          </el-card>
        </div>

        <el-table v-loading="bedUsageLoading" :data="bedUsage" stripe>
          <el-table-column label="病房编号" align="center" prop="roomId" width="110" />
          <el-table-column label="科室" align="center" prop="dept" width="100" />
          <el-table-column label="地点" align="left" prop="location" min-width="170" />
          <el-table-column label="收费标准" align="right" width="120">
            <template #default="{ row }">{{ formatMoney(row.fee) }}/天</template>
          </el-table-column>
          <el-table-column label="床位总数" align="center" prop="total" width="100" />
          <el-table-column label="占用" align="center" prop="occupied" width="90">
            <template #default="{ row }">
              <el-tag type="warning" size="small">{{ row.occupied }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="空闲" align="center" prop="free" width="90">
            <template #default="{ row }">
              <el-tag type="success" size="small">{{ row.free }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="维修" align="center" prop="repair" width="90" />
          <el-table-column label="使用率" align="center" min-width="200">
            <template #default="{ row }">
              <el-progress
                :percentage="row.usageRate"
                :color="getUsageColor(row.usageRate)"
                :stroke-width="14"
                text-inside
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ==================== 医生工作量统计 ==================== -->
      <el-tab-pane label="医生工作量" name="workload">
        <el-form :inline="true" label-width="88px" class="mb-10px">
          <el-form-item label="统计时间">
            <el-date-picker
              v-model="workloadRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="!w-260px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="loadWorkload">
              <Icon icon="ep:search" class="mr-5px" /> 统计
            </el-button>
            <el-button @click="resetWorkloadRange">最近 30 天</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="workloadLoading" :data="workload" stripe>
          <el-table-column label="医生编号" align="center" prop="docId" width="110" />
          <el-table-column label="医生" align="center" prop="docName" width="110" />
          <el-table-column label="科室" align="center" prop="dept" width="100" />
          <el-table-column label="职称" align="center" prop="title" width="130" />
          <el-table-column label="治疗人次" align="center" prop="treatCount" width="110" />
          <el-table-column label="负责病人数" align="center" prop="patientCount" width="120" />
          <el-table-column label="工作量对比" align="center" min-width="220">
            <template #default="{ row }">
              <el-progress
                :percentage="toPercent(row.treatCount, maxTreatCount)"
                :stroke-width="14"
                :color="getUsageColor(toPercent(row.treatCount, maxTreatCount))"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-10px text-12px text-[var(--el-text-color-secondary)]">
          统计口径：所选时间范围内该医生开具的治疗记录数量，按人次倒序排列。
        </div>
      </el-tab-pane>

      <!-- ==================== 病人住院台账 ==================== -->
      <el-tab-pane label="住院台账" name="ledger">
        <el-form :inline="true" label-width="76px" class="mb-10px">
          <el-form-item label="病案号">
            <el-input
              v-model="ledgerQuery.patientId"
              placeholder="请输入病案号"
              clearable
              class="!w-170px"
            />
          </el-form-item>
          <el-form-item label="病人姓名">
            <el-input
              v-model="ledgerQuery.patientName"
              placeholder="请输入姓名"
              clearable
              class="!w-170px"
            />
          </el-form-item>
          <el-form-item label="入院日期">
            <el-date-picker
              v-model="ledgerRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="!w-260px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="handleLedgerQuery">
              <Icon icon="ep:search" class="mr-5px" /> 查询
            </el-button>
            <el-button @click="resetLedgerQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="ledgerLoading" :data="ledger" stripe>
          <el-table-column label="住院号" align="center" prop="inhId" width="90" />
          <el-table-column label="病案号" align="center" prop="patientId" width="110" />
          <el-table-column label="病人" align="center" prop="patientName" width="100" />
          <el-table-column label="科室" align="center" prop="dept" width="90" />
          <el-table-column label="病房" align="center" prop="roomId" width="90" />
          <el-table-column label="床位" align="center" width="80">
            <template #default="{ row }">{{ row.bedNo }} 床</template>
          </el-table-column>
          <el-table-column label="入院时间" align="center" width="150">
            <template #default="{ row }">{{ formatDateTime(row.inTime) }}</template>
          </el-table-column>
          <el-table-column label="出院时间" align="center" width="150">
            <template #default="{ row }">{{ formatDateTime(row.outTime) }}</template>
          </el-table-column>
          <el-table-column label="住院天数" align="center" width="100">
            <template #default="{ row }">{{ row.days }} 天</template>
          </el-table-column>
          <el-table-column label="费用" align="right" width="110">
            <template #default="{ row }">{{ formatMoney(row.fee) }}</template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="90" fixed="right">
            <template #default="{ row }">
              <el-tag :type="row.outTime ? 'info' : 'success'" size="small">
                {{ row.outTime ? '已出院' : '在院' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script lang="ts" setup>
import * as StatisticsApi from '@/api/hospital/statistics'
import * as RecordApi from '@/api/hospital/record-inh'
import type {
  BedUsageVO,
  DoctorWorkloadVO,
  HospitalOverviewVO,
  LedgerReq,
  RecordInhVO
} from '@/api/hospital/types'
import { genderLabel } from '../constants'
import { formatDateTime, formatMoney, getLastDaysRange } from '../utils'
import { useHospitalFeedback } from '../useHospitalFeedback'

defineOptions({ name: 'HospitalStatistics' })

const { reportError } = useHospitalFeedback()

const activeTab = ref('inHospital')

/* -------------------- 概览 & 在院病人 -------------------- */
const overview = ref<HospitalOverviewVO>()
const inHospitalList = ref<RecordInhVO[]>([])
const inHospitalLoading = ref(false)

const loadOverview = async () => {
  try {
    overview.value = await StatisticsApi.getOverview()
  } catch (error) {
    reportError(error, '查询概览数据失败')
  }
}

const loadInHospital = async () => {
  inHospitalLoading.value = true
  try {
    inHospitalList.value = await RecordApi.getInHospitalList()
  } catch (error) {
    reportError(error, '查询在院病人失败')
  } finally {
    inHospitalLoading.value = false
  }
}

/* -------------------- 床位使用 -------------------- */
const bedUsage = ref<BedUsageVO[]>([])
const bedUsageLoading = ref(false)

const loadBedUsage = async () => {
  bedUsageLoading.value = true
  try {
    bedUsage.value = await StatisticsApi.getBedUsage()
  } catch (error) {
    reportError(error, '查询床位统计失败')
  } finally {
    bedUsageLoading.value = false
  }
}

const bedSummary = computed(() =>
  bedUsage.value.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      free: acc.free + item.free,
      occupied: acc.occupied + item.occupied,
      repair: acc.repair + item.repair
    }),
    { total: 0, free: 0, occupied: 0, repair: 0 }
  )
)

/* -------------------- 医生工作量 -------------------- */
const workload = ref<DoctorWorkloadVO[]>([])
const workloadLoading = ref(false)
const workloadRange = ref<[string, string] | null>(getLastDaysRange(30))

const loadWorkload = async () => {
  workloadLoading.value = true
  try {
    workload.value = await StatisticsApi.getDoctorWorkload(
      workloadRange.value?.[0],
      workloadRange.value?.[1]
    )
  } catch (error) {
    reportError(error, '查询医生工作量失败')
  } finally {
    workloadLoading.value = false
  }
}

const resetWorkloadRange = () => {
  workloadRange.value = getLastDaysRange(30)
  loadWorkload()
}

const maxTreatCount = computed(() =>
  workload.value.reduce((max, item) => Math.max(max, item.treatCount), 1)
)

const toPercent = (value: number, max: number) => {
  if (!max) return 0
  return Math.min(100, Math.round((value / max) * 100))
}

const getUsageColor = (rate: number) => {
  if (rate >= 80) return '#f56c6c'
  if (rate >= 50) return '#e6a23c'
  return '#67c23a'
}

/* -------------------- 住院台账 -------------------- */
const ledger = ref<RecordInhVO[]>([])
const ledgerLoading = ref(false)
const ledgerRange = ref<[string, string] | null>(null)
const ledgerQuery = reactive<LedgerReq>({})

const loadLedger = async () => {
  ledgerLoading.value = true
  try {
    ledger.value = await RecordApi.getLedger(ledgerQuery)
  } catch (error) {
    reportError(error, '查询住院台账失败')
  } finally {
    ledgerLoading.value = false
  }
}

const handleLedgerQuery = () => {
  ledgerQuery.beginTime = ledgerRange.value?.[0]
  ledgerQuery.endTime = ledgerRange.value?.[1]
  loadLedger()
}

const resetLedgerQuery = () => {
  ledgerQuery.patientId = undefined
  ledgerQuery.patientName = undefined
  ledgerQuery.beginTime = undefined
  ledgerQuery.endTime = undefined
  ledgerRange.value = null
  loadLedger()
}

onMounted(() => {
  loadOverview()
  loadInHospital()
  loadBedUsage()
  loadWorkload()
  loadLedger()
})
</script>

<style scoped>
.stat-card {
  min-width: 200px;
}
</style>