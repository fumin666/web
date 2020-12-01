/**
 * Created by dgunzi on 2019/04/01.
 */

import Wrapper from '@/home/Wrapper'
import configModel from './ConfigModel'

// 资产管理
const AssetsRouter = [
  {
    path: 'assetsManage_list',
    component: Wrapper,
    meta: {name: '配置项管理'},
    children: [
      {
        path: '',
        name: 'assetsManage_configurationItem',
        component: () => import('@/pages/Assets_ConfigurationManage/AssetsManage')
      }
    ]
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
    path: 'assets_setting',
    component: Wrapper,
    meta: {name: '参数配置'},
    children: [
      {
        path: '/',
        name: 'assetsManage_systemConfiguration',
        component: () => import('@/pages/Assets_Setting/AssetSetting')
      },
      {
        path: 'serverConfig',
        name: 'AssetsAll_assets_audit_index',
        component: () => import('@/pages/Assets_Audit/AssetAudit'),
        meta: {name: '审计配置'}
      },
      {
        path: 'logInfo/:assetUuid',
        name: 'AssetsAll_assets_logAudit_assetDetail',
        component: () => import('@/pages/Assets_DifferentView/LogAuditView'),
        meta: {name: '日志审计信息'}
      },
      {
        path: 'assetsDetail/:assetUuid/:type',
        name: 'AssetsAll_assets_audit_assetsDetail',
        component: () => import('@/pages/Assets_DifferentView/DatabaseAuditView'),
        meta: {name: '数据库审计信息'}
      },
      {
        path: 'serverDeploy/:appId',
        name: 'AssetsAll_assets_audit_serverDeploy',
        component: () => import('@/pages/Assets_Audit/ServerDeploy'),
        meta: {name: '关联审计配置'}
      },
      {
        path: 'serverTranslate/:appId',
        name: 'AssetsAll_assets_audit_serverTranslate',
        component: () => import('@/pages/Assets_Audit/ServerTranslate'),
        meta: {name: '业务翻译'}
      }
    ]
  },
  {
    path: 'assetsHealthCheck',
    component: Wrapper,
    meta: {name: '资产健康性检查'},
    children: [
      {
        path: '',
        name: 'assetsManage_assetInspect',
        component: () => import('@/pages/Assets_HealthCheck/AssetsHealthCheck')
      },
      {
        path: 'healthCheckResult/:uuid',
        name: 'AssetsAll_pollingResultDetail',
        component: () => import('@/pages/Assets_HealthCheck/HealthCheckResult'),
        meta: {name: '检查结果详情'}
      }
    ]
  },
  {
    path: 'safeCheck',
    component: () => import('@/pages/Assets_SafetyInspection/SafetyInspection'),
    name: 'assetsManage_dbSafeCheck',
    meta: {
      name: '等保安全检查'
    }
  },
  {
    path: '3d_room',
    component: () => import('@/pages/Assets_3droom/RoomIndex'),
    name: 'AUTH-TRUE-assets_3droom',
    meta: {
      name: '3D机房'
    }
  },
  {
  path: 'assets_ipam',
  component: Wrapper,
  meta: {name: 'IP台账'},
  children: [
      {
        path: '',
        name: 'assetsManage_ipam',
        component: () => import('@/pages/Assets_Ipam/Ipam.vue')
      },
      {
        path: 'subnetDetail/:id',
        name: 'assetsManage_detail',
        meta: {name: '子网详情'},
        component: () => import('@/pages/Assets_Ipam/IpamSubnetDetail.vue')
      }
    ]
  },
  { path: 'assets_businessManagement',
    name: 'assetsManage_businessManagement',
    component: () => import('@/pages/Assets_Business/Business'),
    meta: {name: '业务系统管理'}},
  ...configModel
]

export default AssetsRouter;
