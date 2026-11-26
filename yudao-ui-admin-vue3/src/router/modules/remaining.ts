import { Layout } from '@/utils/routerHelper'

/**
 * 静态路由
 *
 * 本项目已移除 yudao 的「后端菜单 / 角色权限」机制，所有页面都在这里注册：
 * 登录、医院管理、标签页刷新、错误页。
 */
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectRoot',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/hospital/statistics',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/hospital',
    component: Layout,
    name: 'Hospital',
    redirect: '/hospital/room',
    meta: {
      title: '医院管理',
      icon: 'ep:first-aid-kit',
      alwaysShow: true
    },
    children: [
      {
        path: 'room',
        name: 'HospitalRoom',
        component: () => import('@/views/hospital/room/index.vue'),
        meta: {
          title: '病房管理',
          icon: 'ep:office-building'
        }
      },
      {
        path: 'bed',
        name: 'HospitalBed',
        component: () => import('@/views/hospital/bed/index.vue'),
        meta: {
          title: '病床管理',
          icon: 'ep:grid'
        }
      },
      {
        path: 'patient',
        name: 'HospitalPatient',
        component: () => import('@/views/hospital/patient/index.vue'),
        meta: {
          title: '病人档案',
          icon: 'ep:user'
        }
      },
      {
        path: 'doctor',
        name: 'HospitalDoctor',
        component: () => import('@/views/hospital/doctor/index.vue'),
        meta: {
          title: '医生档案',
          icon: 'ep:avatar'
        }
      },
      {
        path: 'inpatient',
        name: 'HospitalInpatient',
        component: () => import('@/views/hospital/inpatient/index.vue'),
        meta: {
          title: '住院管理',
          icon: 'ep:notebook'
        }
      },
      {
        path: 'treat',
        name: 'HospitalTreat',
        component: () => import('@/views/hospital/treat/index.vue'),
        meta: {
          title: '治疗记录',
          icon: 'ep:document'
        }
      },
      {
        path: 'statistics',
        name: 'HospitalStatistics',
        component: () => import('@/views/hospital/statistics/index.vue'),
        meta: {
          title: '统计报表',
          icon: 'ep:data-analysis'
        }
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'ErrorPage',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export default remainingRouter