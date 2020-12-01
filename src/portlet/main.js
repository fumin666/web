const install = function(Vue, opts = {}) {
  /* istanbul ignore if */
  if (install.installed) return;
  // 资产管理
  Vue.component('assets-statistics', () => import('./Assets_Portlet/AssetsStatistics'));
  // 资产分布
  Vue.component('asset-distribute', () => import('./Assets_Portlet/AssetDistribute'));
  // 健康性检查
  Vue.component('assets-health-check', () => import('./Assets_Portlet/AssetsHealthCheck'));
  // 参数配置
  Vue.component('asset-setting', () => import('./Assets_Portlet/AssetSetting'));
  // 资产发现
  Vue.component('asset-find-again', () => import('./Assets_Portlet/AssetFindAgain'));
  // 业务系统管理
  Vue.component('asset-manager', () => import('./Assets_Portlet/AssetManager'));
  // IP台账
  Vue.component('asset-ipam', () => import('./Assets_Portlet/AssetIpam'));

  /* 运维中心 */
  // 运维资产
  Vue.component('ops-asset', () => import('./Operation_Portlet/Ops-asset'));
  // 命令复核
  Vue.component('ops-cmd', () => import('./Operation_Portlet/Ops-cmd'));
  // 密码会同
  Vue.component('ops-pwd', () => import('./Operation_Portlet/Ops-pwd'));
  // 邀请协助
  Vue.component('ops-invite', () => import('./Operation_Portlet/Ops-invite'));
  // 本周审核情况统计
  Vue.component('ops-weekAudit', () => import('./Operation_Portlet/Ops-weekAudit'));
  // 本周运维量统计
  Vue.component('ops-weekOps', () => import('./Operation_Portlet/Ops-weekOps'));
  // 运维日志
  Vue.component('ops-log', () => import('./Operation_Portlet/Ops-log'));
  // 特殊运维
  Vue.component('ops-specialOps', () => import('./Operation_Portlet/Ops-special'));
  // 批量执行
  Vue.component('ops-batchOps', () => import('./Operation_Portlet/Ops-batchOps'));
  // 资产配置保存
  Vue.component('ops-assetConfig', () => import('./Operation_Portlet/Ops-assetConfig'));

// 空白块
  Vue.component('s-empty', () => import('./Empty'));

  /* 账号管理 */
  // 账号状态统计
  Vue.component('account-status', () => import('./Account_Portlet/AccountStatus'));
  // 账号稽核
  Vue.component('account-audit', () => import('./Account_Portlet/AccountAudit'));
  // 账号同步
  Vue.component('account-sync', () => import('./Account_Portlet/AccountSync'));
  // 账号改密
  Vue.component('account-assetpwd', () => import('./Account_Portlet/AccountChangePass'));
  // 组织机构管理
  Vue.component('account-man', () => import('./Account_Portlet/AccountMan'));
  // 授权策略管理
  Vue.component('auth-config', () => import('./Account_Portlet/AuthConfig'));
  // 用户权限管理
  Vue.component('system-auth', () => import('./Account_Portlet/SystemAuthConfig'));

  /* 事件中心 */
  // 事件级别统计
  Vue.component('event-level', () => import('./Event_Portlet/EventLevel'));
  // 告警事件统计
  Vue.component('event-alarm', () => import('./Event_Portlet/EventAlarm'));
  // 最新事件
  Vue.component('event-latest', () => import('./Event_Portlet/EventLatest'));
  // 告警方式配置
  Vue.component('event-alarm-cfg', () => import('./Event_Portlet/EventAlarmCfg'));
  // 命令集管理
  Vue.component('event-cmd', () => import('./Event_Portlet/EventCmd'));

  /* 流程中心 */
  // 最近24小时工单
  Vue.component('process-lastDay-order', () => import('./Process_Portlet/ProcessLastDayOrder.vue'));
  // 流程配置
  Vue.component('process-setUp', () => import('./Process_Portlet/ProcessSetUp.vue'));
  // 我的待办
  Vue.component('process-myWillDone', () => import('./Process_Portlet/MyWillDone.vue'));
  // 我的审批
  Vue.component('process-myApproval', () => import('./Process_Portlet/MyApproval.vue'));
  // 我的已办
  Vue.component('process-myHaveDone', () => import('./Process_Portlet/MyHaveDone.vue'));
  // 我的关注
  Vue.component('process-myAttention', () => import('./Process_Portlet/MyAttention.vue'));
  // 快速搜索
  Vue.component('process-speedSearch', () => import('./Process_Portlet/SpeedSearch.vue'));
  // 本周工作量统计
  Vue.component('process-weeklyWorkload', () => import('./Process_Portlet/WeeklyWorkload.vue'));
  // 知识库
  Vue.component('process-knowledgeLibrary', () => import('./Process_Portlet/KnowledgeLibrary.vue'));
  // 服务请求
  Vue.component('process-serviceRequest', () => import('./Process_Portlet/ServiceRequest.vue'));
  // 我的工单数量汇总
  Vue.component('process-myOrdersNumber', () => import('./Process_Portlet/MyOrdersNumber.vue'));

  /* ---------- 自动化运维中心 ---------- */
// 脚本库概况
  Vue.component('auto-ops', () => import('./AutoOps_Portlet/AutoOps'));
// 自动化巡检概况
  Vue.component('auto-inspect', () => import('./AutoOps_Portlet/AutoInspect'));
// 近期脚本执行日志
  Vue.component('script-log', () => import('./AutoOps_Portlet/ScriptLog'));
// 自动化巡检
  Vue.component('auto-inspect-nav', () => import('./AutoOps_Portlet/AutoInspectNav'));

  /* 资产监控部分 */
// 拓扑视图
  Vue.component('monitor-topo', () => import('./AssetsMonitor_Portlet/Topo'));
// 电视墙
  Vue.component('monitor-tvwall', () => import('./AssetsMonitor_Portlet/Tvwall'));
// 链路管理
  Vue.component('monitor-link', () => import('./AssetsMonitor_Portlet/Link'));
// MIB工具
  Vue.component('monitor-mib', () => import('./AssetsMonitor_Portlet/Mib'));
// 关注监控资产
  Vue.component('monitor-attention', () => import('./AssetsMonitor_Portlet/newAttention'));
// 资产监控排行TOP5
  Vue.component('monitor-rank-top5', () => import('./AssetsMonitor_Portlet/RankTop5'));
// 业务服务管理
  Vue.component('monitor-service-manage', () => import('./AssetsMonitor_Portlet/ServiceManage'));

// 人员视角
  Vue.component('diy-user-info', () => import('./Diy_User/UserInfo'));
  Vue.component('diy-user-list', () => import('./Diy_User/UserList'));
  Vue.component('diy-user-permission', () => import('./Diy_User/UserPermission'));
  Vue.component('diy-user-ops-log', () => import('./Diy_User/OpsLog'));
  Vue.component('diy-user-process-todo', () => import('./Diy_User/ProcessTodo'));
  Vue.component('diy-user-ops-asset', () => import('./Diy_User/OpsAsset'));
  Vue.component('diy-user-process-order', () => import('./Diy_User/ProcessOrder'));
// 推荐首页
  Vue.component('diy-safeadministrator', () => import('@/pages/Recommended_HomePage/SafetyManager'));
  Vue.component('diy-omateamLeader', () => import('@/pages/Recommended_HomePage/Operation'));
  Vue.component('diy-omaadministrator', () => import('@/pages/Recommended_HomePage/SystemAdministrator'));
  Vue.component('diy-omaoperation', () => import('@/pages/Recommended_HomePage/TeamDirector'));
  Vue.component('diy-auditadministrator', () => import('@/pages/Recommended_HomePage/Auditor'));

// 资产视角
  Vue.component('diy-asset-asset-list', () => import('./Diy_Asset/AssetList'));
  Vue.component('diy-asset-ops-script', () => import('./Diy_Asset/OpsScript'));
  Vue.component('diy-asset-asset-manage', () => import('./Diy_Asset/AssetManage'));
  Vue.component('diy-asset-asset-monitor', () => import('./Diy_Asset/AssetMonitor'));

// 单模块
// 资产监控
  Vue.component('diy-single-asset-monitor', () => import('./Diy_Single/AssetMonitor'));

// 系统运行状况
  Vue.component('diy-single-sys-status', () => import('./Diy_Single/SysStatus'));

// 监控事件统计
  Vue.component('diy-single-event-monitor', () => import('./Diy_Single/EventMonitor'));

// 监控告警统计
  Vue.component('diy-single-monitor-alarm', () => import('./Diy_Single/MonitorAlarm'));

// 产生告警最多的资产
  Vue.component('diy-single-asset-alarm', () => import('./Diy_Single/AssetAlarm'));

// 产生事件最多的资产
  Vue.component('diy-single-asset-event', () => import('./Diy_Single/AssetEvent'));

// 最新 恢复||未恢复 事件
  Vue.component('diy-single-event-recover', () => import('./Diy_Single/EventRecover'));

// 全网日志级别数量统计图(近24小时)
  Vue.component('diy-siem-log-level', () => import('./Diy_Siem/LogLevelNumber'));

// 日志审计事件统计
  Vue.component('diy-siem-log-event', () => import('./Diy_Siem/LogAuditEvents'));

// 潜在危害分析
  Vue.component('diy-potential-hazards', () => import('./Diy_Siem/PotentialHazards'));

// 全网日志数量时间分布图
  Vue.component('diy-siem-log-quantity-time', () => import('./Diy_Siem/LogQuantityTime'));

// 全网日志来源统计TOP10(最近24小时)
  Vue.component('diy-siem-log-source', () => import('./Diy_Siem/LogSource'));

// 数据库审计事件
  Vue.component('diy-dba-audit-event', () => import('./Diy_Dba/DbaAuditEvent'));

// 数据库审计告警统计
  Vue.component('diy-dba-audit-warning', () => import('./Diy_Dba/DbaAuditWarning'));

// 产生告警最多的数据库统计
  Vue.component('diy-dba-most-alarm', () => import('./Diy_Dba/DbaMostAlarm'));

// 审计记录时间走势
  Vue.component('diy-dba-audit-record-time', () => import('./Diy_Dba/AuditRecordTime'));

// 告警记录时间走势
  Vue.component('diy-dba-warning-record-time', () => import('./Diy_Dba/WarningRecordTime'));

// 审计对象
  Vue.component('diy-dba-audit-target', () => import('./Diy_Dba/AuditTarget'));
  // 系统一级页面
  // 默认首页
  Vue.component('home-home-page', () => import('@/home/HomePage'));
  // 账号管理
  Vue.component('home-account-manage', () => import('@/home/Account/AccountManage'));
  // 资产管理
  Vue.component('home-assets-manage', () => import('@/home/AssetsManage/AssetsAll'));
  // 资产监控
  Vue.component('home-assets-monitor', () => import('@/home/AssetsMonitor/AssetsMonitor'));
  // 事件中心
  Vue.component('home-event-center', () => import('@/home/EventCenter/EventCenter'));
  // 报表中心
  Vue.component('home-log-center', () => import('@/home/LogCenter/LogCenterBase'));
  // 等级保护
  Vue.component('home-grade-protect', () => import('@/home/GradeProtect/GradeProtect'));
  // 运维中心
  Vue.component('home-operation-center', () => import('@/home/OperationCenter/OperationAllCenter'));
  // 流程中心
  Vue.component('home-process-center', () => import('@/home/ProcessCenter/ProcessCenter'));
  // 安全通报
  Vue.component('home-safety-bulletin', () => import('@/home/SafetyBulletin/SafetyBulletin'));
  // 系统设置
  Vue.component('home-system-set', () => import('@/home/SystemSet/SystemSet'));
  // 自动化运维
  Vue.component('home-auto-operation-center', () => import('@/home/AutoOps/AutoOpsCenter'));
  // 配置中心
  Vue.component('home-config-center', () => import('@/home/ConfigCenter/ConfigCenter'));
  // 运维审批
  Vue.component('home-operational-approval', () => import('@/home/Approval'));
  // 运维审批成功
  Vue.component('home-approval-success', () => import('@/home/ApprovalSuccess'));

  // 针对同一用户具有不同角色权限的页面
  // 账号管理(安全管理员(IAM_EXTEND&OMA))
  Vue.component('home-account-security', () => import('@/pages/Account_SecuritySet/AccountSecurity'));
  // 账号管理(安全管理员(非IAM或非OMA))
  Vue.component('home-account-non', () => import('@/pages/Account_SecuritySet/AccountSecurityConf'));
  // 资产管理(安全管理员)
  Vue.component('home-assets-security', () => import('@/pages/Assets_AssetList/AssetListBaseSecurity'));
  // 运维中心(系统管理员)
  Vue.component('home-operation-system', () => import('@/home/OperationCenter/OperateCenterSys'));
  // 流程中心(配置管理员)
  Vue.component('home-process-configuration', () => import('@/pages/Process_SetUp/ProcessSetUp'));
  // 等级保护(系统管理员)
  Vue.component('home-grade-system', () => import('@/pages/GradeProtect/GradeRulesetAuth'));
  // 等级保护(安全管理员)
  Vue.component('home-grade-security', () => import('@/pages/GradeProtect/GradeRulesetAuth'));
  // 安全通报(系统管理员)
  Vue.component('home-bulletin-set', () => import('@/pages/Safety_BulletinTypeSet/BulletinTypeSetList'));
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
}
