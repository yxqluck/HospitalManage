<script lang="ts" setup>
import ErrorPage from './ErrorPage.vue'

defineOptions({ name: 'Error500' })
</script>

<template>
  <ErrorPage code="500" title="服务器错误" description="抱歉，服务器开小差了，请稍后再试" />
</template>