<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <Icon icon="ep:first-aid-kit" :size="42" class="text-[var(--el-color-primary)]" />
        <h1>{{ title }}</h1>
        <p>病房 · 病床 · 病人 · 医生 · 住院 · 治疗 · 统计</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" autocomplete="username">
            <template #prefix>
              <Icon icon="ep:user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
            autocomplete="current-password"
          >
            <template #prefix>
              <Icon icon="ep:lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-button class="w-full" type="primary" :loading="loading" @click="handleLogin">
          登 录
        </el-button>
      </el-form>

      <div class="login-tip">演示账号：{{ username }} / {{ password }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import {
  LOCAL_LOGIN_PASSWORD,
  LOCAL_LOGIN_USERNAME,
  useUserStore
} from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

defineOptions({ name: 'Login' })

const title = import.meta.env.VITE_APP_TITLE || '医院管理系统'
const username = LOCAL_LOGIN_USERNAME
const password = LOCAL_LOGIN_PASSWORD

const message = useMessage()
const router = useRouter()
const route = useRoute()

const formRef = ref()
const loading = ref(false)
const form = reactive({
  username,
  password
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const redirectPath = () => {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/'
}

const handleLogin = async () => {
  if (loading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await useUserStore().login(form.username, form.password)
    usePermissionStore().generateRoutes()
    message.success('登录成功')
    await router.replace(redirectPath())
  } catch (error) {
    message.error((error as Error)?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 15% 20%, rgba(64, 158, 255, 0.35), transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(103, 194, 58, 0.25), transparent 45%),
    linear-gradient(135deg, #1f2d3d 0%, #0f172a 100%);
}

.login-card {
  width: 380px;
  padding: 40px 36px 28px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 18px 50px rgb(0 0 0 / 35%);
}

.login-brand {
  margin-bottom: 26px;
  text-align: center;

  h1 {
    margin: 10px 0 6px;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    padding: 4px 11px;
  }
}

.login-tip {
  margin-top: 16px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>