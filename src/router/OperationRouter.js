/**
 * Created by dgunzi on 2019/04/01.
 */

// 运维
const OperationRouter = [
  {
    path: 'oper_equipment',
    name: 'operationCenter_operAssets',
    component: () => import('@/pages/Operation_Equipment/Equipment'),
    meta: {
      name: '运维资产'
    }
  },
  {
    path: 'oper_assets/:assetUuid',
    name: 'AUTH-TRUE-operationCenter_operAssetsDetail',
    component: () => import('@/pages/Assets_DifferentView/OperationView'),
    meta: {
      name: '运维审计信息'
    }
  },
  {
    path: 'oper_special',
    name: 'operationCenter_specialCount',
    component: () => import('@/pages/Operation_SpecialOperation/Special'),
    meta: {
      name: '特殊运维'
    }
  },
  {
    path: 'oper_batch',
    name: 'operationCenter_batchCount',
    component: () => import('@/pages/Operation_BatchExecution/BatchExecute'),
    meta: {
      name: '批量执行'
    }
  },
  {
    path: 'oper_log',
    name: 'operationCenter_operationLog',
    component: () => import('@/pages/Operation_OperationalLog/Log'),
    meta: {
      name: '运维日志'
    }
  },
  {
    path: 'oper_command',
    name: 'operationCenter_checkCmd',
    component: () => import('@/pages/Operation_Command/Command'),
    meta: {
      name: '命令复核'
    }
  },
  {
    path: 'oper_pass',
    name: 'operationCenter_pwdCon',
    component: () => import('@/pages/Operation_PwdHuitong/Password'),
    meta: {
      name: '密码会同'
    }
  },
  {
    path: 'oper_assist',
    name: 'operationCenter_inviteHelp',
    component: () => import('@/pages/Operation_AssistInvite/Assist'),
    meta: {
      name: '邀请协助'
    }
  },
  {
    path: 'oper_auditstatistic',
    name: 'operationCenter_auditStatistic',
    component: () => import('@/home/OperationCenter/AuditStatistics'),
    meta: {
      name: '本周审核情况统计'
    }
  },
  {
    path: 'oper_statistic',
    name: 'operationCenter_operStatistic',
    component: () => import('@/home/OperationCenter/OperateStatistics'),
    meta: {
      name: '本周运维量统计'
    }
  },
/*  {
    path: 'oper_equipmentConfig',
    name: 'operationCenter_assetsConfiguration',
    component: () => import('@/pages/Operation_EquipmentConfig/ConfigTask'),
    meta: {
      name: '资产配置保存'
    }
  }, */
  {
    path: 'netDeviceconfig',
    component: () => import('@/pages/Operation_NetDeviceConfig/NetDeviceConfigTab'),
    name: 'operationCenter_networkDevicesConfig',
    meta: {
      name: '网络设备配置管理'
    }
  },
  {
    path: 'oper_param_tab',
    name: 'operationCenter_parameterSet',
    component: () => import('@/pages/Operation_TotalSet/ParamTab'),
    meta: {
      name: '参数设置'
    }
  }
];

export default OperationRouter;
