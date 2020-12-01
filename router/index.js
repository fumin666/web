// Vue + Router
import Vue from 'vue'
import Router from 'vue-router-sunflower'
import Login from '@/home/Login'
import OauthLogin from '@/home/OauthLogin'
import Home from '@/home/Home'
import Error from '@/home/404.vue'
import Diy from '@/home/Diy'
Vue.use(Router)

// 懒加载路由
export const asyncRouter = [
  {
    path: '/',
    beforeEnter (to, from, next) {
      next('/login')
    }
  },
  {
    path: '/HomePage',
    name: 'homePage',
    component: () => import('@/home/BaseComponent'),
    meta: {
      name: '首页'
    }
  },
  {
    // Q1UE问题优化
    path: '/ConfigPage',
    component: Home,
    children: [
      {path: '', name: 'ConfigurationWizard', component: () => import('@/home/ConfigPage')}
    ],
    meta: {
      name: '配置向导'
    }
  },
  {
    path: '/ConfigGuide',
    component: {template: '<router-view></router-view>'},
    children: [
      {path: '', name: 'FirstUsageWizard', component: () => import('@/home/ConfigGuide')}
    ],
    meta: {
      name: '配置向导'
    }
  },
  {
    path: '/AccountManage',
    component: Home,
    children: [
      {path: '', name: 'accountManage', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '账号管理'
    }
  },

  {
    path: '/AssetsAll',
    component: Home,
    children: [
      {path: '', name: 'assetsManage', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '资产管理'
    }
  },
  {
    path: '/AssetsMonitor',
    component: Home,
    children: [
      {path: '', name: 'assetsMonitor', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '资产监控'
    }
  },
  {
    path: '/EventCenter',
    component: Home,
    children: [
      {path: '', name: 'eventCenter', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '事件中心'
    }
  },
  {
    path: '/GradeProtect',
    component: Home,
    children: [
      {path: '', name: 'gradeProtect', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '等级保护'
    }
  },
  {
    path: '/LogCenter',
    component: Home,
    children: [
      {path: '', name: 'logCenter', component: () => import('@/home/BaseComponent'), meta: {name: '报表中心'}}
    ],
    meta: {
      name: '报表中心'
    }
  },
  {
    path: '/OperationCenter',
    component: Home,
    children: [{path: '', name: 'operationCenter', component: () => import('@/home/BaseComponent')}],
    meta: {
      name: '运维中心'
    }
  },
  {
    path: '/ProcessCenter',
    component: Home,
    children: [
      {path: '', name: 'processCenter', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '流程中心'
    }
  },
  {
    path: '/SafetyBulletin',
    component: Home,
    children: [
      {path: '', name: 'safetyBulletin', component: () => import('@/home/BaseComponent')}
    ],
    meta: {
      name: '安全通报'
    }
  },
  {
    path: '/SystemSet',
    component: Home,
    children: [{path: '', name: 'systemSet', component: () => import('@/home/BaseComponent')}],
    meta: {
      name: '系统设置'
    }
  },
  {
    path: '/AutoOpsCenter',
    component: Home,
    children: [{path: '', name: 'autoOperationCenter', component: () => import('@/home/BaseComponent')}],
    meta: {
      name: '自动化运维'
    }
  },
  {
    path: '*',
    name: '404',
    component: Error
  },
  {
    path: '/diy',
    name: 'diy',
    component: Diy,
    meta: {
      name: '首页'
    }
  }

]

// 懒加载路由2 用于配置中心
export const asyncRouterConfigCenter = [
  {
    path: '/',
    beforeEnter (to, from, next) {
      next('/login')
    }
  },
  {
    path: '/ConfigCenter',
    name: 'ConfigCenter',
    component: Home,
    children: [{path: '', name: 'configCenter', component: () => import('@/home/ConfigCenter/ConfigCenter')}],
    meta: {
      name: '配置中心'
    }
  },
  {
    path: '*',
    name: '404',
    component: Error
  }
];

// 未登录时候的路由
export const constRouter = [
  {
    path: '/login',
    name: 'index',
    component: Login
  },
  {
    path: '/oauthlogin',
    name: 'oauthlogin',
    component: OauthLogin
  },
  {
    path: '/staticTvWall',
    name: 'staticTvWallPage',
    component: () => import('@/pages/AssetsMonitor_Tvwall/ViewPage')
  },
  {
    path: '/wenjuan/:userUuid/:paperUuid/:historyUuid',
    name: 'wenjuan',
    component: () => import('@/home/SatisfactionSuerveySubmit')
  },
  { // 运维审批
    path: '/OperationalApproval/:approvaluuid/:applyuuid/:approvaluseruuid',
    name: 'OperationalApproval',
    component: () => import('@/home/Approval')
  },
  { // 审批成功
    path: '/ApprovalSuccess',
    name: 'ApprovalSuccess',
    component: () => import('@/home/ApprovalSuccess')
  }
]

// 导出所有一级路由关键字
function getRouterKeyword() {
  let keywordAry = [];
  asyncRouter.forEach((item) => {
    if (item.path.length > 1) {
      keywordAry.push(item.path.slice(1).split('/:')[0]);
    }
  })
  asyncRouterConfigCenter.forEach((item) => {
    if (item.path.length > 1) {
      keywordAry.push(item.path.slice(1).split('/:')[0]);
    }
  })
  constRouter.forEach((item) => {
    if (item.path.length > 1) {
      keywordAry.push(item.path.slice(1).split('/:')[0]);
    }
  })
  return keywordAry;
}

let router = new Router({
  routes: constRouter,
  linkActiveClass: 'active',
  keywordAry: getRouterKeyword()
})

export default router
