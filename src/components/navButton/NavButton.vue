/*
 * @Author: alex
 * @Date: 2017/5/15
 * @Last Modified by: shifeng
 * @Last Modified time: 2019-01-22 13:59:38
 */

<template>
  <div>
    <ul class="accountBtns">
      <li v-for="item in itemList" :key="item.id" @click="click(item.type, item.data)" class="ellipsis">
        <!--<router-link :to="item.path || ''">-->
        <i :class="`iconfont icon-${item.icon}`"></i>
        <span :title="item.name">
          {{item.name}}
        </span>
        <!--</router-link>-->
      </li>
      <div class="clr"></div>
    </ul>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      itemList: [],
      nav: {
        accountManage: [
          {
            icon: 'manage-author',
            name: '用户权限管理',
            type: 'goto',
            data: 'accountSysPrivilege'
          },
          {
            icon: 'config-safe',
            name: '安全配置',
            type: 'openDialog',
            data: ''
          },
          {
            icon: 'authorization-policy',
            name: '授权策略管理',
            type: 'goto',
            data: 'account_auth'
          },
          {
            icon: 'account-audit',
            name: '账号稽核',
            type: 'goto',
            data: 'accountManage_accountAudit'
          },
          {
            icon: 'account-asset',
            name: '账号改密',
            type: 'goto',
            data: 'accountManage_accountImproved'
          },
          {
            icon: 'account-sync',
            name: '账号同步',
            type: 'goto',
            data: 'accountManage_accountTimeTask'
          },
          {// Q1IAM模块功能增强
            icon: 'business-server',
            name: '业务权限管理',
            type: 'goto',
            data: 'appSystemManage'
          },
          {// Q1IAM模块功能增强
            icon: 'link-equip',
            name: '应用系统登录',
            type: 'openDialog',
            data: 'appSystemAccess'
          }
        ],
        assetsManage: [
          {
            icon: 'find',
            name: '扫描发现',
            type: 'openDialog',
            data: ''
          },
          {
            icon: 'asset-inspection',
            name: '健康性检查',
            type: 'goto',
            data: 'assetsHealthCheck'
          },
          {
            icon: 'system-set',
            name: '参数配置',
            type: 'goto',
            data: 'assets_setting'
          },
          {
            icon: 'set-configure',
            name: '配置项管理',
            type: 'goto',
            data: 'assetsManage_list'
          },
          {
            icon: 'resource',
            name: '配置项采集',
            type: 'goto',
            data: 'config_collect'
          },
          // {//Q4移到配置项采集中了
          //   icon: 'staff',
          //   name: '配置项采集配置',
          //   type: 'goto',
          //   data: 'admin_set/1'
          // },
          {
            icon: 'config-ip',
            name: 'IP台账',
            type: 'goto',
            data: 'assets_ipam'
          },
          // {//Q4屏蔽
          //   icon: 'business-server',
          //   name: '业务系统管理',
          //   type: 'goto',
          //   data: 'assets_businessManagement'
          // },
          {
            icon: '3d',
            name: '3D机房',
            type: 'goto',
            data: '3d_room'
          }
          // {
          //   icon: 'config-ip',
          //   name: '等保安全检查',
          //   type: 'goto',
          //   data: 'safeCheck'
          // }
        ],
        assetsMonitor: [
          {
            icon: 'line',
            name: '链路管理',
            type: 'gotoLine',
            data: ''
          },
          {
            icon: 'frequency',
            name: '监控设置',
            type: 'goto',
            data: 'assetsMonitor_freset'
          },
          {
            icon: 'tv-wall',
            name: '电视墙',
            type: 'goto',
            data: 'tvwall'
          },
          {
            icon: 'mib',
            name: 'MIB工具',
            type: 'goto',
            data: 'assetsMonitor_MIB'
          },
          {
            icon: 'inspection',
            name: '智能运维',
            type: 'goto',
            data: 'assetsMonitor_IntellOps'
          }
        ],
        autoOperationCenter: [
          {
            icon: 'console',
            name: '脚本库管理',
            type: 'goto',
            data: 'script'
          },
          {
            icon: 'resource',
            name: '任务管理',
            type: 'goto',
            data: 'taskManage'
          },
          {
            icon: 'auto-inspection',
            name: '自动化巡检',
            type: 'goto',
            data: 'autoOps_polling'
          },
          {
            icon: 'acquisition-configure',
            name: '配置项采集',
            type: 'goto',
            data: 'config_collect'
          },
          {
            icon: 'sys-enhance',
            name: '安全加固自检',
            type: 'goto',
            data: 'system_reinforce'
          },
          {
            icon: 'subgroup',
            name: '自定义分组',
            type: 'goto',
            data: 'hostList'
          }
        ],
        operationCenter: [
          {
            icon: 'command-review',
            name: '命令复核',
            type: 'goto',
            data: 'oper_command'
          },
          {
            icon: 'union',
            name: '密码会同',
            type: 'goto',
            data: 'oper_pass'
          },
          {
            icon: 'assist',
            name: '邀请协助',
            type: 'goto',
            data: 'oper_assist'
          },
     /*     {
            icon: 'asset-allocation',
            name: '资产配置保存',
            type: 'goto',
            data: 'oper_equipmentConfig'
          }, */
          {
            icon: 'net-device',
            name: '网络设备配置管理',
            type: 'goto',
            data: 'netDeviceconfig'
          },
          {
            icon: 'download',
            name: '工具下载',
            type: 'btnClick',
            data: 'toolDownload'
          },
          {
            icon: 'system-set',
            name: '参数设置',
            type: 'goto',
            data: 'oper_param_tab'
          }
        ],
        eventCenter: [
          {
            icon: 'alarm-set',
            name: '告警方式配置',
            type: 'goto',
            data: 'event_alarmcfg'
          },
          {
            icon: 'config-rule',
            name: '事件规则配置',
            type: 'gotoAuth',
            data: ''
          },
          {
            icon: 'config-commandnli',
            name: '命令集管理',
            type: 'goto',
            data: 'event_cmd'
          }
        ],
        processCenter: [
          {
            icon: 'order-add',
            name: '创建工单',
            type: 'openDialog',
            data: ''
          },
          {
            icon: 'set-process',
            name: '流程配置',
            type: 'goto',
            data: 'ProcessCenter/Process_setup'
          },
          {
            icon: 'knowledge-base',
            name: '知识库',
            type: 'goto',
            data: 'ProcessCenter/knowledgeLibrary'
          },
          {
            icon: 'service-request',
            name: '服务请求',
            type: 'goto',
            data: 'ProcessCenter/serviceRequest'
          }
        ],
        gradeProtect: [
          { icon: 'order', name: '等保报表', type: 'goto', data: 'gradeProtect_dbReport' },
          { icon: 'tag', name: '报表订阅', type: 'goto', data: 'gradeProtect_reportSubscribe' },
          { icon: 'set', name: '等保规则设置', type: 'goto', data: 'gradeProtect_dbRuleSet' },
          { icon: 'nav-process-center', name: '等保工作流', type: 'goto', data: 'gradeProtect_dbWorkflow' },
          { icon: 'knowledge-base', name: '等保知识库', type: 'goto', data: 'gradeProtect_knowledgeBase' }
        ],
        logCenter: [
          { icon: 'classified-report', name: '分类报表', type: 'goto', data: 'logCenter_reportClassify' },
          { icon: 'tag', name: '报表订阅', type: 'goto', data: 'logCenter_reportSubscription' }
        ],
        safetyBulletin: [
          { icon: 'nav-anquantongbao', name: '安全通报任务', type: 'goto', data: 'safetyBulletin_tbTask' },
          { icon: 'config-safe', name: '通报类型设置', type: 'goto', data: 'safetyBulletin_tbconfig' },
          { icon: 'nav-dengjibaohu', name: '等保工作', type: 'goto', data: 'safetyBulletin_dbWork' },
          { icon: 'knowledge-base', name: '知识库', type: 'goto', data: 'safetyBulletin_knowledgeBase' }
        ],
        systemSet: [
          {
            icon: 'strategy',
            name: '系统设置面板',
            type: 'goto',
            data: 'AdvancedSet'
          },
          {
            icon: 'update',
            name: '系统升级',
            type: 'openDialog',
            data: ''
          },
          {
            icon: 'manage-author',
            name: '系统日志管理',
            type: 'goto',
            data: 'OpeLog'
          }
        ]
      }
    }
  },
  props: {
    modelName: {
      type: String
    }
  },
  created() {
    let navObj = this.nav
    let parameter = ''
    this.modelName.indexOf('logCenterDynamic') > -1 ? parameter = 'logCenter' : parameter = this.modelName
    $axios.get(`/iamUserInfo/getSecondMenuListByKeyWord/${parameter}`).then(({ data }) => {
      if (data) {
        /* 权限过滤 */
         let menuList = data.map(item => {
          if (item.shape === 2 || item.shape === 3) {
            return item.menuName
          }
        })
        let currentNav = navObj[this.modelName].filter(item => menuList.indexOf(item.name) !== -1)
        /* 权限不做过滤 */
        // let currentNav = navObj[this.modelName]
        this.itemList = currentNav
        this.$emit('buttonCount', currentNav.length)
      }
    });
  },
  methods: {
    click(type, data) {
      this.$emit(type, data)
    }
  }
}
</script>
