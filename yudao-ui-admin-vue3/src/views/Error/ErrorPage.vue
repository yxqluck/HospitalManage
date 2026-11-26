<script lang="ts" setup>
defineOptions({ name: 'ErrorPage' })

defineProps<{
  code: string
  title: string
  description: string
}>()

const router = useRouter()

const goHome = () => {
  router.replace('/')
}
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-[#f5f7fa]">
    <div class="text-[96px] font-bold leading-none text-[#409eff]">{{ code }}</div>
    <div class="mt-24px text-[22px] font-medium text-[#303133]">{{ title }}</div>
    <div class="mt-12px text-[14px] text-[#909399]">{{ description }}</div>
    <ElButton class="mt-28px" type="primary" @click="goHome">返回首页</ElButton>
  </div>
</template>