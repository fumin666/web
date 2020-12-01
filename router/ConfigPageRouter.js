/*
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导路由
 * @Date: 2020-01-22 11:13:06
 * @LastEditors  : mybells
 */
import Wrapper from '@/home/Wrapper'

const ConfigPageRouter = [
  {
    path: 'orgTopo',
    name: 'accountManage_org',
    keyWord: 'accountManage_organizationChart',
    component: () => import('@/pages/Account_Organization/OrgGraph'),
    meta: {
      name: '组织机构管理'
    }
  },
  {
    path: 'assetStaff',
    name: 'accountManage_org',
    keyWord: 'accountManage_peopleManagement',
    component: () => import('@/pages/Account_Man/AssetStaff'),
    meta: {
      name: '人员管理'
    }
  },
  {
    path: 'assets_list',
    component: Wrapper,
    meta: {name: '资产管理列表'},
    children: [
      {
        path: '',
        name: 'assetsManage_assetStatistics',
        component: () => import('@/pages/Assets_AssetList/AssetListBase')
      },
      {
        path: '',
        name: 'assetsManage_omaAssetStatistics',
        component: () => import('@/pages/Assets_AssetList/AssetListBase')
      },
      {
        path: 'assetsAccountExport',
        name: 'AssetsAll_accountExport',
        meta: {name: '资产账号密码导出'},
        component: () => import('@/pages/Assets_AssetList/components/AccountExport')
      },
      {
        path: 'assetAdd',
        name: 'AssetsAll_assetAdd',
        component: () => import('@/pages/Assets_AssetList/AssetAdd'),
        meta: {name: '资产新增'}
      },
      {
        path: 'assetEdit/:assetUuid/:tabIndex',
        name: 'AssetsAll_assetEdit',
        component: () => import('@/pages/Assets_AssetList/AssetAdd'),
        meta: {name: '资产编辑'}
      },
      {
        path: 'assetDetail/:assetUuid',
        name: 'AssetsAll_assetDetail',
        component: () => import('@/pages/Assets_DifferentView/AssetsManageViewBase'),
        meta: {name: '资产详情'}
      },
      {
        path: 'ipam_details',
        name: 'ipam_details',
        component: () => import('@/pages/Assets_Ipam/Perspective/IpamDetails'),
        meta: {
          name: 'IP地址详情'
        }
      },
      {
        path: 'relationalGraph/:assetUuid',
        name: 'AssetsAll_relationalGraph',
        component: () => import('@/pages/Assets_AssetList/RelationalGraph'),
        meta: {name: '资产关系图'}
      },
      {
        path: 'dataAssetInfo/:assetUuid',
        name: 'AssetsAll_dataAssetInfo',
        component: () => import('@/pages/Assets_DifferentView/DataAssetInfo'),
        meta: {name: '数据库资产信息'}
      },
      {
        path: 'assetAccountInfo/:assetUuid',
        name: 'AssetsAll_assetAccountInfo',
        component: () => import('@/pages/Assets_DifferentView/AccountInfoView'),
        meta: {name: '账号信息'}
      },
      {
        path: 'configInfo/:assetUuid',
        name: 'AssetsAll_configInfo',
        component: () => import('@/pages/Assets_DifferentView/ConfigurationInfoView'),
        meta: {name: '配置信息'}
      },
      {
        path: 'eventInfo/:assetUuid',
        name: 'AssetsAll_eventInfo',
        component: () => import('@/pages/Assets_DifferentView/EventInfoView'),
        meta: {name: '事件信息'}
      },
      {
        // 资产id
        path: 'configuration_baseline/:id',
        component: Wrapper,
        meta: {name: '配置基准'},
        children: [
          {
            path: '',
            name: 'ConfigurationBaseline',
            component: () => import('@/pages/Assets_AssetList/ConfigurationBaseline/ConfigurationBaseline')
          },
          {
            // 基线id
            path: 'view/:histroyId',
            name: 'ConfigurationBaseline_View',
            component: () => import('@/pages/Assets_AssetList/ConfigurationBaseline/View'),
            meta: {name: '查看'}
          },
          {
            path: 'current',
            name: 'ConfigurationBaseline_current',
            component: () => import('@/pages/Assets_AssetList/ConfigurationBaseline/View'),
            meta: {name: '当前'}
          }
        ]
      }
    ]
  },
  {
    path: 'assetsMonitor_list',
    component: Wrapper,
    meta: {name: '资产监控列表'},
    children: [
      {
        path: '/',
        name: 'AUTH-TRUE-monitorList',
        component: () => import('@/pages/AssetsMonitor_View/MonitorList')
      }
    ]
  },
  {
    path: 'account_auth',
    name: 'accountManage_AuthPolicy',
    component: () => import('@/pages/Account_Auth/Auth'),
    meta: {name: '授权策略管理'}
  },
  {
    path: 'db_setting',
    component: Wrapper,
    meta: {name: '数据库审计配置'},
    keyWord: 'assetsManage_dbaAuditConf',
    children: [
      {
        path: '/',
        name: 'assetsManage_systemConfiguration',
        component: () => import('@/pages/Assets_Audit/AssetAudit')
      }
    ]
  },
  {
    path: 'log_setting',
    component: Wrapper,
    meta: {name: '日志审计配置'},
    keyWord: 'assetsManage_logAuditConf',
    children: [
      {
        path: '/',
        name: 'assetsManage_systemConfiguration',
        component: () => import('@/pages/Siem_System/AssetsLogsManage/LogManageMain')
      }
    ]
  },
  {
    path: 'config_collect',
    component: () => import('@/pages/AutoOps_ConfigCollect/AdminConfig.vue'),
    meta: {
      name: '配置项采集'
    },
    children: [
      {
        path: '',
        name: 'autoOperationCenter_collectTask'
      }
    ]
  },
  {
    path: 'Process_setup',
    name: 'processCenter_workflowConfig',
    component: Wrapper,
    meta: {
      name: '流程配置'
    },
    children: [
      {
        path: '',
        name: 'processCenter_workflowConfig',
        component: () => import('@/pages/Process_SetUp/ProcessSetUp.vue')
      }
    ]
  }
];

export default ConfigPageRouter;
