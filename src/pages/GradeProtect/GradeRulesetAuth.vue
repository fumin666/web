/**
* Created by fumin on 2020/02/18.
* 等级保护-等保规则设置.
*/

<template>
  <s-scrollbar wrap-style="max-height: calc(100vh - 155px);">
    <section class="left-menu-box grade-rule-box" id="securitySetDialog">
      <s-row>
        <s-col :span="4">
          <s-menu :active-name="currentView" accordion :open-names=[openNames] @on-select="selection" style="padding-top:16px;font-size:14px">
            <s-submenu name="gradeProtect_rsIdAuth" v-if="judgeRoleBtn('gradeProtect_rsIdAuth')">
              <template slot="title">
                <i class="iconfont icon-user"></i>
                身份鉴别
              </template>
              <s-menu-item name="pane1" v-if="judgeRoleBtn('gradeProtect_rsLoginAuthSet')" title="登录认证设置"><span class="menu-dot"></span>登录认证设置</s-menu-item>
              <s-menu-item name="pane2" v-if="judgeRoleBtn('gradeProtect_rsLoginSafeSet')" title="登录安全设置"><span class="menu-dot"></span>登录安全设置</s-menu-item>
              <s-menu-item name="pane3" v-if="judgeRoleBtn('gradeProtect_rsPasswordPolicyConf')" title="密码策略配置"><span class="menu-dot"></span>密码策略配置</s-menu-item>
              <s-menu-item name="pane4" v-if="judgeRoleBtn('gradeProtect_rsAccountToClose')" title="资产账号改密"><span class="menu-dot"></span>资产账号改密</s-menu-item>
            </s-submenu>
            <s-submenu name="gradeProtect_rsAccessControl" v-if="judgeRoleBtn('gradeProtect_rsAccessControl')">
              <template slot="title">
                <i class="iconfont icon-script-set"></i>
                访问控制
              </template>
              <s-menu-item name="pane5" v-if="judgeRoleBtn('gradeProtect_rsUserAuthManage')" title="用户权限管理"><span class="menu-dot"></span>用户权限管理</s-menu-item>
              <s-menu-item name="pane6" v-if="judgeRoleBtn('gradeProtect_rsUserManage')" title="人员管理"><span class="menu-dot"></span>人员管理</s-menu-item>
              <s-menu-item name="pane7" v-if="judgeRoleBtn('gradeProtect_rsAuthPolicyManage')" title="授权策略管理"><span class="menu-dot"></span>授权策略管理</s-menu-item>
              <s-menu-item name="pane8" v-if="judgeRoleBtn('gradeProtect_rsPasswordExpired')" title="密码过期账号统计"><span class="menu-dot"></span>密码过期账号统计</s-menu-item>
              <s-menu-item name="pane9" v-if="judgeRoleBtn('gradeProtect_rsAccountExpired')" title="账号过期账号统计"><span class="menu-dot"></span>账号过期账号统计</s-menu-item>
            </s-submenu>
            <s-submenu name="gradeProtect_rsBackUpAndReStore" v-if="judgeRoleBtn('gradeProtect_rsBackUpAndReStore')">
              <template slot="title">
                <i class="iconfont icon-folder"></i>
                数据备份与恢复
              </template>
              <s-menu-item name="pane10" v-if="judgeRoleBtn('gradeProtect_rsSystemBackUp')" title="系统备份"><span class="menu-dot"></span>系统备份</s-menu-item>
              <s-menu-item name="pane11" v-if="judgeRoleBtn('gradeProtect_rsSystemLog')" title="系统日志管理"><span class="menu-dot"></span>系统日志管理</s-menu-item>
            </s-submenu>
            <s-submenu name="gradeProtect_rsSafeManageCenter" v-if="judgeRoleBtn('gradeProtect_rsSafeManageCenter')">
              <template slot="title">
                <i class="iconfont icon-config-safe"></i>
                安全管理中心
              </template>
              <s-menu-item name="pane12" v-if="judgeRoleBtn('gradeProtect_rsSystemSetPanel')" title="系统设置面板"><span class="menu-dot"></span>系统设置面板</s-menu-item>
              <s-menu-item name="pane13" v-if="judgeRoleBtn('gradeProtect_rsLatestIncident')" title="最新事件"><span class="menu-dot"></span>最新事件</s-menu-item>
              <s-menu-item name="pane14" v-if="judgeRoleBtn('gradeProtect_rsRuleConf')" title="事件规则配置"><span class="menu-dot"></span>事件规则配置</s-menu-item>
              <s-menu-item name="pane15" v-if="judgeRoleBtn('gradeProtect_rsAlarmModeConf')" title="告警方式配置"><span class="menu-dot"></span>告警方式配置</s-menu-item>
            </s-submenu>
            <s-submenu name="gradeProtect_rsAuditAndInspection" v-if="judgeRoleBtn('gradeProtect_rsAuditAndInspection')">
              <template slot="title">
                <i class="iconfont icon-config-audit"></i>
                审核和检查
              </template>
              <s-menu-item name="pane16" v-if="judgeRoleBtn('gradeProtect_rsSecurityCheck')" title="等保安全检查"><span class="menu-dot"></span>等保安全检查</s-menu-item>
            </s-submenu>
            <s-submenu name="gradeProtect_rsSafeOperationManage" v-if="judgeRoleBtn('gradeProtect_rsSafeOperationManage')">
              <template slot="title">
                <i class="iconfont icon-protocol-audit"></i>
                安全运维管理
              </template>
              <s-menu-item name="pane17" v-if="judgeRoleBtn('gradeProtect_rsConfigurationManage')" title="配置项管理"><span class="menu-dot"></span>配置项管理</s-menu-item>
            </s-submenu>
          </s-menu>
        </s-col>
        <s-col :span="20" style="padding-left: 10px;font-size: 14px;">
          <component :is="currentView" :activeTab="currentView"></component>
        </s-col>
      </s-row>
    </section>
  </s-scrollbar>
</template>
<script>
  // import $axios from 'sunflower-ajax';
  // 身份鉴别
  import pane1 from '@/pages/Account_SecuritySet/SecuritySetTab/LoginSet'
  import pane2 from '@/pages/Account_SecuritySet/LoginSecuritySet.vue'
  import pane3 from '@/pages/Account_SecuritySet/SecuritySetTab/PwdConfig'
  import pane4 from '../Account_TimedTask/ChangePass.vue'
  // 访问控制
  import pane5 from '@/pages/Account_SysPrivilege/SysPrivilege'
  import pane6 from '@/pages/Account_Man/AssetStaff'
  import pane7 from '@/pages/Account_Auth/Auth'
  import pane8 from '@/pages/Log_Usage/PwOverdueAccount'
  import pane9 from '@/pages/Log_Usage/OverdueAccount'
  // 数据备份与恢复
  import pane10 from '@/pages/SysManage_Backup/Backup'
  import pane11 from '@/pages/SysManage_OpeLog/OpeLog'
  // 安全管理中心
  import pane12 from '@/home/SystemSet/AdvancedSet'
  import pane13 from '@/pages/Event_List/App'
  import pane14 from '@/pages/Event_Rules/Rules'
  import pane15 from '@/pages/Event_AlarmCfg/Alarm'
  // 审核和检查
  import pane16 from '@/pages/Assets_SafetyInspection/SafetyInspection'
  // 安全运维管理
  import pane17 from '@/pages/Assets_ConfigurationManage/AssetsManage'
  import navs from '@/components/navButton/NavButton.vue';
  export default {
    data() {
      return {
        isShow: false,
        currentView: '',
        currentData: [],
        tabNameArr: [
          'gradeProtect_rsLoginAuthSet',
          'gradeProtect_rsLoginSafeSet',
          'gradeProtect_rsPasswordPolicyConf',
          'gradeProtect_rsAccountToClose',
          'gradeProtect_rsUserAuthManage',
          'gradeProtect_rsUserManage',
          'gradeProtect_rsAuthPolicyManage',
          'gradeProtect_rsPasswordExpired',
          'gradeProtect_rsAccountExpired',
          'gradeProtect_rsSystemBackUp',
          'gradeProtect_rsSystemLog',
          'gradeProtect_rsSystemSetPanel',
          'gradeProtect_rsLatestIncident',
          'gradeProtect_rsRuleConf',
          'gradeProtect_rsAlarmModeConf',
          'gradeProtect_rsSecurityCheck',
          'gradeProtect_rsConfigurationManage'
        ],
        openNames: '' // 默认展开项
      }
    },
    components: {
      pane1,
      pane2,
      pane3,
      pane4,
      pane5,
      pane6,
      pane7,
      pane8,
      pane9,
      pane10,
      pane11,
      pane12,
      pane13,
      pane14,
      pane15,
      pane16,
      pane17,
      navs
    },
    created() {
      this.currentView = this.tabIndexName(this.tabNameArr)
      let arr = []
      if (this.judgeRoleBtn('gradeProtect_rsIdAuth')) {
        arr.push('gradeProtect_rsIdAuth')
      } else if (this.judgeRoleBtn('gradeProtect_rsAccessControl')) {
        arr.push('gradeProtect_rsAccessControl')
      } else if (this.judgeRoleBtn('gradeProtect_rsBackUpAndReStore')) {
        arr.push('gradeProtect_rsBackUpAndReStore')
      } else if (this.judgeRoleBtn('gradeProtect_rsSafeManageCenter')) {
        arr.push('gradeProtect_rsSafeManageCenter')
      } else if (this.judgeRoleBtn('gradeProtect_rsAuditAndInspection')) {
        arr.push('gradeProtect_rsAuditAndInspection')
      } else if (this.judgeRoleBtn('gradeProtect_rsSafeOperationManage')) {
        arr.push('gradeProtect_rsSafeOperationManage')
      }
      this.openNames = arr[0]
    },
    methods: {
      selection(key) {
        this.currentView = key
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .grade-rule-box
    .login-set
      margin 20px 10px
  .left-menu-box
    .s-menu-item
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      .menu-dot
        vertical-align middle
        width 4px
        height 4px
        margin-right 10px
        display inline-block
        border-radius 50%
</style>
