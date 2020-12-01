<template>
  <section class="high-level-set left-menu-box">
    <s-col span="4">
      <s-menu :active-name="currentView" @on-select="selection" style="padding-top:16px;font-size:14px">
        <s-menu-item name="pane1" v-if="judgeRoleBtn('eventCenter_monitorRule') || judgeRoleBtn('gradeProtect_rsMonitorRule')">
          <i class="iconfont icon-business-monitor"></i>
          监控规则
        </s-menu-item>
        <s-menu-item name="pane2" v-if="judgeRoleBtn('eventCenter_operAuditRule') || judgeRoleBtn('gradeProtect_rsOperAuditRule')">
          <i class="iconfont icon-oper"></i>
          运维审计规则
        </s-menu-item>
        <s-menu-item name="pane3" v-if="judgeRoleBtn('eventCenter_dbaAuditRule') || judgeRoleBtn('gradeProtect_rsDBAuditRule')">
          <i class="iconfont icon-asset-change"></i>
          数据库审计规则
        </s-menu-item>
        <s-menu-item name="pane4" v-if="judgeRoleBtn('eventCenter_businessAuditRule') || judgeRoleBtn('gradeProtect_rsBussinessAuditRule')">
          <i class="iconfont icon-business-server"></i>
          业务审计规则
        </s-menu-item>
        <s-submenu name="pane5" v-if="judgeRoleBtn('eventCenter_logAuditRule') || judgeRoleBtn('gradeProtect_rsLogAuditRule')">
          <template slot="title">
            <i class="iconfont icon-log-audit"></i>
            日志审计规则
          </template>
          <s-menu-item name="pane6" v-if="judgeRoleBtn('eventCenter_logAuditEventRule') || judgeRoleBtn('eventCenter_monitorRule')" title="事件规则"><span class="menu-dot"></span>事件规则</s-menu-item>
          <s-menu-item name="pane7" v-if="judgeRoleBtn('eventCenter_logAuditLevelProtect') || judgeRoleBtn('eventCenter_monitorRule')" title="等级保护规则"><span class="menu-dot"></span>等级保护规则</s-menu-item>
          <s-menu-item name="pane8" v-if="judgeRoleBtn('eventCenter_logAuditDangerous') || judgeRoleBtn('eventCenter_monitorRule')" title="潜在危害分析规则"><span class="menu-dot"></span>潜在危害分析规则</s-menu-item>
        </s-submenu>
      </s-menu>
    </s-col>
    <s-col span="20">
      <component :is="currentView" :activeTab="currentView" style="padding-top:16px;padding-left:20px;"></component>
    </s-col>
  </section>
</template>

<script>
  import pane1 from './RulesMonitor'
  import pane2 from './RulesOperation'
  import pane3 from './RulesDb'
  import pane4 from './RulesBusiness'
  import pane5 from '../Siem_System/EventRules/LogsAuditMain'
  import pane6 from '@/pages/Siem_System/EventRules/LogsAudit'
  import pane7 from '@/pages/Siem_System/EventRules/LevelProtect'
  import pane8 from '@/pages/Siem_System/EventRules/HazardAnalysis'
  export default {
    data() {
      return {
        currentView: 'pane1',
        tabNameArr: [
          'eventCenter_monitorRule',
          'eventCenter_operAuditRule',
          'eventCenter_dbaAuditRule',
          'eventCenter_businessAuditRule',
          'eventCenter_logAuditRule',
          'eventCenter_logAuditEventRule',
          'eventCenter_logAuditLevelProtect',
          'eventCenter_logAuditDangerous'
        ] // 页签名字的集合(顺序和页签一致)
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
      pane8
    },
    methods: {
      selection(key) {
        this.currentView = key
      }
    },
    created() {
      this.currentView = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>

<style lang="stylus">
  .left-menu-box
    .s-menu-item
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      .menu-dot
        display inline-block
        width 4px
        height 4px
        border-radius 50%
        margin 0 10px
        vertical-align middle
</style>
