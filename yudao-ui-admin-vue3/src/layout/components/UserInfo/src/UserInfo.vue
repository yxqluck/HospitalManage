<template>
  <ElDropdown class="header-action" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <ElAvatar :src="avatar" alt="" class="!w-35px rounded-[50%]" />
      <span class="pl-[5px] text-14px text-[var(--top-header-text-color)] <lg:hidden">
        {{ userName }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="loginOut">
          <Icon icon="ep:switch-button" />
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import avatarImg from '@/assets/imgs/avatar.gif'
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'UserInfo' })

const { t } = useI18n()
const { replace } = useRouter()
const userStore = useUserStore()
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const avatar = computed(() => userStore.user.avatar || avatarImg)
const userName = computed(() => userStore.user.nickname || '管理员')

const loginOut = async () => {
  try {
    await ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
  } catch {
    return
  }
  await userStore.loginOut()
  replace('/login')
}
</script>