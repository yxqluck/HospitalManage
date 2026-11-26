<script lang="ts" setup>
import ErrorPage from './ErrorPage.vue'

defineOptions({ name: 'Error403' })
</script>

<template>
  <ErrorPage code="403" title="无访问权限" description="抱歉，你没有权限访问该页面" />
</template>