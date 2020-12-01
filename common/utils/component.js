/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-10 18:00:30
 * @LastEditTime : 2020-01-03 16:43:42
 * @LastEditors  : mybells
 */
const COMPONENT = {
  账号管理: {
    组织机构管理: {
      name: 'account-man',
      width: '50%',
      height: '600px'
    },
    账号稽核: {
      name: 'account-audit',
      width: '50%',
      height: '600px'
    },
    账号改密: {
      name: 'account-assetpwd',
      width: '50%',
      height: '600px'
    },
    账号同步: {
      name: 'account-sync',
      width: '50%',
      height: '600px'
    },
    用户权限管理: {
      name: 'system-auth',
      width: '50%',
      height: '600px'
    },
    授权策略管理: {
      name: 'auth-config',
      width: '50%',
      height: '600px'
    },
    账号状态统计: {
      name: 'account-status',
      width: '25%',
      height: '300px'
    }
  },

  资产管理: {
    资产管理: {
      name: 'assets-statistics',
      width: '50%',
      height: '600px'
    },
    健康性检查: {
      name: 'assets-health-check',
      width: '50%',
      height: '600px'
    },
    参数配置: {
      name: 'asset-setting',
      width: '100%',
      height: '600px'
    },
    资产分布: {
      name: 'asset-distribute',
      width: '25%',
      height: '300px'
    },
    资产发现: {
      name: 'asset-find-again',
      width: '50%',
      height: '600px'
    },
    // 业务系统管理: {
    //   name: 'asset-manager',
    //   width: '100%',
    //   height: '600px'
    // },
    IP台账: {
      name: 'asset-ipam',
      width: '100%',
      height: '600px'
    }
  },

  资产监控: {
    拓扑视图: {
      name: 'monitor-topo',
      width: '50%',
      height: '600px'
    },
    电视墙: {
      name: 'monitor-tvwall',
      width: '50%',
      height: '600px'
    },
    链路管理: {
      name: 'monitor-link',
      width: '50%',
      height: '600px'
    },
    业务服务巡检: {
      name: 'monitor-service-inspection',
      width: '50%',
      height: '600px'
    },
    MIB工具: {
      name: 'monitor-mib',
      width: '50%',
      height: '600px'
    },
    关注监控资产: {
      name: 'monitor-attention',
      width: '25%',
      height: '300px'
    },
    资产监控排行TOP5: {
      name: 'monitor-rank-top5',
      width: '25%',
      height: '300px'
    },
    业务服务管理: {
      name: 'monitor-service-manage',
      width: '100%',
      height: '200px'
    }
  },

  自动化运维中心: {
    自动化巡检: {
      name: 'auto-inspect-nav',
      width: '50%',
      height: '600px'
    },
    脚本库概况: {
      name: 'auto-ops',
      width: '50%',
      height: '600px'
    },
    近期脚本执行日志: {
      name: 'script-log',
      width: '25%',
      height: '300px'
    },
    自动化巡检概况: {
      name: 'auto-inspect',
      width: '25%',
      height: '300px'
    }
  },

  运维中心: {
    运维资产: {
      name: 'ops-asset',
      width: '50%',
      height: '600px'
    },
    命令复核: {
      name: 'ops-cmd',
      width: '50%',
      height: '600px'
    },
    密码会同: {
      name: 'ops-pwd',
      width: '50%',
      height: '600px'
    },
    邀请协助: {
      name: 'ops-invite',
      width: '50%',
      height: '600px'
    },
    本周审核情况统计: {
      name: 'ops-weekAudit',
      width: '25%',
      height: '300px'
    },
    本周运维量统计: {
      name: 'ops-weekOps',
      width: '25%',
      height: '300px'
    },
    运维日志: {
      name: 'ops-log',
      width: '25%',
      height: '600px'
    },
    特殊运维: {
      name: 'ops-specialOps',
      width: '25%',
      height: '150px'
    },
    批量执行: {
      name: 'ops-batchOps',
      width: '25%',
      height: '150px'
    }
  },

  事件中心: {
    命令集管理: {
      name: 'event-cmd',
      width: '50%',
      height: '600px'
    },
    最新事件: {
      name: 'event-latest',
      width: '100%',
      height: '700px'
    },
    规则配置: {
      name: 'event-rules',
      width: '50%',
      height: '600px'
    },
    告警方式配置: {
      name: 'event-alarm-cfg',
      width: '50%',
      height: '600px'
    },
    当天事件走势: {
      name: 'event-day',
      width: '25%',
      height: '300px'
    },
    本周事件走势: {
      name: 'event-week',
      width: '25%',
      height: '300px'
    },
    本月事件走势: {
      name: 'event-month',
      width: '25%',
      height: '300px'
    },
    事件级别统计: {
      name: 'event-level',
      width: '25%',
      height: '300px'
    },
    告警事件统计: {
      name: 'event-alarm',
      width: '25%',
      height: '300px'
    }
  },
  // 安全通报: {
  //   我的审批: {
  //     name: 'process-setUp',
  //     width: '100%',
  //     height: '600px'
  //   },
  //   等保工作提醒: {
  //     name: 'process-setUp',
  //     width: '100%',
  //     height: '600px'
  //   }
  // },
  流程中心: {
    流程配置: {
      name: 'process-setUp',
      width: '100%',
      height: '600px'
    },
    我的待办: {
      name: 'process-myWillDone',
      width: '100%',
      height: '600px'
    },
    我的审批: {
      name: 'process-myApproval',
      width: '50%',
      height: '600px'
    },
    我的已办: {
      name: 'process-myHaveDone',
      width: '50%',
      height: '600px'
    },
    我的关注: {
      name: 'process-myAttention',
      width: '50%',
      height: '600px'
    },
    快速搜索: {
      name: 'process-speedSearch',
      width: '50%',
      height: '600px'
    },
    本周工作量统计: {
      name: 'process-weeklyWorkload',
      width: '25%',
      height: '300px'
    },
    最近24小时工单: {
      name: 'process-lastDay-order',
      width: '50%',
      height: '300px'
    },
    我的工单数量汇总: {
      name: 'process-myOrdersNumber',
      width: '25%',
      height: '300px'
    },
    知识库: {
      name: 'process-knowledgeLibrary',
      width: '100%',
      height: '600px'
    },
    服务请求: {
      name: 'process-serviceRequest',
      width: '100%',
      height: '600px'
    }
  }
};

export default COMPONENT;
