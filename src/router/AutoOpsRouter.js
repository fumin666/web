/**
 * Created by dgunzi on 2019/04/01.
 */

import Wrapper from '@/home/Wrapper'
import configModel from './ConfigModel'

// 自动化运维
const AutoOpsRouter = [
  {
    path: 'system_reinforce',
    name: 'autoOperationCenter_systemReinforce',
    meta: {name: '安全加固自检'},
    component: () => import('@/pages/AutoOps_SystemReinforce/SystemReinforce.vue')
  },
  {
    path: 'script',
    name: 'autoOperationCenter_scriptLibrary',
    component: () => import('@/pages/AutoOps_Script/ScriptLibrary.vue'),
    meta: {
      name: '脚本库管理'
    },
    children: [
      {
        path: '',
        name: 'autoOperationCenter_scriptLibrary',
        component: () => import('@/pages/AutoOps_Script/Library.vue')
      }
    ]
  },
  {
    path: 'taskManage',
    name: 'autoOperationCenter_taskManage',
    component: () => import('@/pages/AutoOps_Script/AutoTaskManage.vue'),
    meta: {
      name: '任务管理'
    }
  },
  {
    path: 'hostList',
    component: () => import('@/pages/AutoOps_HostList/Index'),
    meta: {
      name: '自定义分组'
    },
    children: [
      {
        path: '',
        name: 'autoOperationCenter_customGroup',
        component: () => import('@/pages/AutoOps_HostList/HostList')
      },
      {
        path: 'hostDetail',
        name: 'AUTH-TRUE-autoOperationCenter_hostDetail',
        component: () => import('@/pages/AutoOps_HostList/HostDetail'),
        meta: {
          name: '主机详情'
        }
      }
    ]
  },
  {
    path: 'hostAssetDetail/:assetUuid',
    name: 'AUTH-TRUE-autoOperationCenter_hostAssetDetail',
    component: () => import('@/pages/Assets_DifferentView/AutoOpsView.vue'),
    meta: {
      name: '自动化运维信息'
    }
  },
  {
    path: 'autoops_log/:type',
    name: 'autoOperationCenter_scriptExeLog',
    component: () => import('@/pages/AutoOps_ConfigCollect/AutoOpsLog.vue'),
    meta: {
      name: '近期脚本执行日志'
    }
  },
  {
    path: 'dayInspection',
    name: 'autoOperationCenter_30DayInspection',
    component: () => import('@/pages/AutoOps_Script/AutoTaskManage.vue'),
    meta: {
      name: '近30天脚本执行状况统计'
    }
  },
  {
    path: 'autoOps_polling',
    component: Wrapper,
    meta: {name: '自动化巡检'},
    children: [
      {
        path: '',
        name: 'autoOperationCenter_autoOpsPolling',
        component: () => import('@/pages/Assets_Polling/AssetPolling')
      },
      {
        path: 'pollingResultDetail/:uuid',
        name: 'autoOps_pollingResultDetail',
        component: () => import('@/pages/Assets_Polling/PollingResultDetail'),
        meta: {name: '巡检结果详情'}
      }
    ]
  },
  ...configModel
]

export default AutoOpsRouter;
