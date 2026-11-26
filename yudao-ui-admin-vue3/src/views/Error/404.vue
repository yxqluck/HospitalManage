<script lang="ts" setup>
import ErrorPage from './ErrorPage.vue'

defineOptions({ name: 'Error404' })
</script>

<template>
  <ErrorPage code="404" title="页面不存在" description="抱歉，你访问的页面不存在或已被移除" />
</template>