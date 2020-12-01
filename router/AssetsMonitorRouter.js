/**
 * Created by dgunzi on 2019/04/01.
 */

import Wrapper from '@/home/Wrapper'

// 资产监控
const AssetsMonitorRouter = [
  {
    path: 'assetsMonitor_list:id?',
    component: Wrapper,
    meta: {name: '资产监控列表'},
    children: [
      {
        path: '/',
        name: 'AUTH-TRUE-monitorList',
        component: () => import('@/pages/AssetsMonitor_View/MonitorList')
      },
      {
        path: 'assetDetail/:assetUuid',
        name: 'AssetsAll_assetDetailMonitor',
        component: () => import('@/pages/Assets_DifferentView/AssetsMonitorView'),
        meta: {name: '监控信息'}
      },
      {
        path: 'info/:assetUuid',
        component: Wrapper,
        meta: {name: 'IP信息'},
        children: [
          {
            path: '',
            name: 'AssetsMonitor_info',
            component: () => import('@/pages/Assets_DifferentView/AssetsMonitorView'),
            meta: {name: '  '}
          },
          {
            path: 'InfoDetail/:comp/:curMonitorObj',
            component: () => import('@/pages/AssetsMonitor_List/MonitorDialog/InfoDetail'),
            meta: {name: '资产详情'}
          }
        ]
      },
      {
        path: 'monitorSet',
        name: 'monitorSet',
        component: () => import('@/pages/AssetsMonitor_List/MonitorScoreSet'),
        meta: {name: '资产监控打分设置'}
      },
      {
        path: 'assets_pollingResult',
        component: Wrapper,
        meta: {name: '资产巡检'},
        children: [
          {
            path: '',
            name: 'assets_pollingResult',
            component: () => import('@/pages/Assets_Polling/PollingResultTab')
          },
          {
            path: 'pollingResultDetail/:uuid',
            component: () => import('@/pages/Assets_Polling/PollingResultDetail'),
            meta: {name: '巡检结果详情'}
          }
        ]
      }
    ]
  },
  {
    path: 'assetsMonitor_view',
    component: Wrapper,
    meta: {name: '资产监控统计图'},
    children: [
      {
        path: '/',
        name: 'AUTH-TRUE-monitorList',
        component: () => import('@/pages/AssetsMonitor_View/MonitorView')
      }
    ]
  },
  {
    path: 'assetsMonitor_concernList',
    component: Wrapper,
    meta: {name: '关注监控资产列表'},
    children: [
      {
        path: '/',
        name: 'assetsMonitor_focusAssets',
        component: () => import('@/pages/AssetsMonitor_List/MonitorList')
      }
    ]
  },
  {
    path: 'assetsMonitor_topN',
    name: 'assetsMonitor_assetTop5',
    component: () => import('@/pages/AssetsMonitor_TopN/MonitorTopN'),
    meta: {name: '资产监控排行TOP5'}
  },
  {
    path: 'assetsMonitor_MIB',
    name: 'assetsMonitor_mibTools',
    component: () => import('@/pages/AssetsMonitor_MIB/MibLists'),
    meta: {name: 'MIB管理'}
  },
  {
    path: 'assetsMonitor_IntellOps',
    name: 'assetsMonitor_intellOperations',
    component: () => import('@/pages/AssetsMonitor_IntelligenceOperation/IntelligenceOpe'),
    meta: {name: '智能运维'}
  },
  {
    path: 'assetsMonitor_businessService',
    name: 'assetsMonitor_businessServiceManagement',
    component: () => import('@/pages/AssetsMonitor_BusinessService_New/BusinessIndex'),
    meta: {name: '业务服务管理'}
  },
  {
    path: 'assetsMonitor_businessList',
    name: 'assetsMonitor_businessServiceManagement',
    component: () => import('@/pages/AssetsMonitor_BusinessService_New/BusinessService'),
    meta: {name: '业务服务管理列表'}
  },
  {
    path: 'assetsMonitor_freset',
    name: 'assetsMonitor_monitorFrequencySettings',
    component: () => import('@/pages/AssetsMonitor_List/Freset'),
    meta: {name: '监控设置'}
  },
  {
    path: 'assetsMonitor_topo',
    component: Wrapper,
    meta: {name: '拓扑视图'},
    children: [
      {
        path: '',
        name: 'assetsMonitor_topologyView',
        component: () => import('@/pages/AssetsMonitor_TopologyManage/Main')
      },
      {
        path: 'topo_detail/:id',
        component: () => import('@/pages/AssetsMonitor_TopologyManage/Main'),
        meta: {name: '拓扑视图'}
      },
      {
        path: 'link/:showapp',
        name: 'assetsMonitorTopoLink',
        meta: {name: '链路管理'},
        component: () => import('@/pages/AssetsMonitor_TopologyManage/Link')
      },
      {
        path: 'statistics/:id', // 拓扑统计
        name: 'assetsMonitorTopoStatistics',
        meta: {name: '拓扑统计'},
        component: () => import('@/pages/AssetsMonitor_TopologyManage/Statistics')
      }
    ]
  },
  {
    path: 'assetsMonitor_link/:showapp',
    name: 'assetsMonitor_linkManagement',
    meta: {name: '链路管理'},
    component: () => import('@/pages/AssetsMonitor_TopologyManage/Link')
  },
  {
    path: 'tvwall',
    component: Wrapper,
    meta: {name: '电视墙'},
    children: [
      {
        path: '',
        name: 'assetsMonitor_tvWall',
        component: () => import('@/pages/AssetsMonitor_Tvwall/Index')
      }
    ]
  }
]

export default AssetsMonitorRouter;
