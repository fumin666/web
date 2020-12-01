/**
* Created by fumin on 2019/10/17.
* 报表中心-分类报表.
*/

<template>
  <section class="left-menu-box">
    <s-row>
      <s-col :span="4" style="margin-top: 15px;">
        <s-menu @on-select="selection"
                @on-open-change='selectionAll'
                accordion :active-name="currentUuid"
                :active-key="currentUuid"
                :open-names=[activeOpen]
                style="font-size: 14px;"
                v-if="isShow">
          <s-submenu v-for="(item, index) in currentData" :key="index" :title="item.name" :name="item.uuid">
            <template slot="title"><i :class="`iconfont icon-${item.node.icon}`"></i>{{item.name}}</template>
            <s-menu-item v-for="(item1, index1) in item.childrenList" @click.native="changeUuid(item1, item1.uuid,item1.node.keyWord.split('_')[1])" :key="index1" :title="item1.name" :name="item1.node.uuid">
              <span class="menu-dot"></span>{{item1.name}}</s-menu-item>
          </s-submenu>
        </s-menu>
      </s-col>
      <s-col :span="20" style="padding-left: 10px;">
        <component :is="currentView" :safeTaskUuid='safeTaskUuid' :key='safeTaskUuid' :reportData="reportData" :activeTab="currentView"></component>
      </s-col>
    </s-row>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';
  // 基础通用报表
  import accountStatusCount from '@/pages/Log_AccountStatusCount/AccountStatusCount'
  import assetTypeAndStatus from '@/pages/Log_AssetClass/AssetClass'
  import eventLevelCount from '@/pages/Log_EventAccount/EventAccount'
  import alarmEvents from '@/pages/Log_EventAlarm/EventAlarm'
  import systemgeneral from '@/pages/Log_SystemGeneral/SystemGeneral'
  import reportlevel from '@/pages/Log_LevelReport/Report_Level_1'
  import userClassify from '@/pages/Log_PersonCategory/PersonCategory';
  import ipamLog from '@/pages/Log_Ipam/IpamTable'
  import accountUsage from '@/pages/Log_Usage/UsageTab'
  import userOnline from '@/pages/Log_UserOnline/UserOnline'
  // 资产监控报表
  import monitorNature from '../Log_OperationMonitor/Performance'
  import itcompMonitorTopN from '../Log_OperationMonitor/AssetMonitor/AssetMonitor.vue'
  import itcompMonitorAva from '../Log_OperationMonitor/UseAccount'
  // 基础运维报表
  import operationworkloadCount from '@/pages/Log_WorkloadCount/WorkloadCount'
  import operationBlockingCount from '@/pages/Log_OperationManage/OperationManage'
  import focusAuditsCount from '@/pages/Log_OrderSet/OrderSet'
  import operationCount from '@/pages/Log_OperationStatistics/OperationStatistics'
  import assetAccountCount from '@/pages/Log_AccountClassify/AccountClassify'
  import collectAndModityPw from '@/pages/Log_InstitutionAccount/InstitutionAccount'
  // 日志审计报表
  import simeLogOverview from '@/pages/Siem_System/LogSiem/LogSummary'
  import simeLog from '@/pages/Siem_System/LogSiem/LogSiemMain'
  import simeLogReport from '@/pages/Siem_System/LogSiem/LogReport'
  import simeLogStrategy from '@/pages/Siem_System/LogSiem/LogStrategyReport'
  import simeLogEvent from '@/pages/Siem_System/LogSiem/LogEventReport'
  import simeLevelProtect from '@/pages/Siem_System/LogSiem/LevelProtectReport'
  import simePotentialDangerous from '@/pages/Siem_System/LogSiem/DamageReport'
  // 流程管理报表
  import itilIncident from '@/pages/Log_ProcessReport/Report_Event/ReportEventTab'
  import itilProblem from '@/pages/Log_ProcessReport/Report_Problem/ReportProblemTab'
  import itilChange from '@/pages/Log_ProcessReport/Report_Change/ReportChangeTab'
  import itilPublish from '@/pages/Log_ProcessReport/Report_Release/ReportReleaseTab'
  import itilKnowledge from '@/pages/Log_ProcessReport/Report_Knowledge/ReportKnowledgeTab'
  import itilRequest from '@/pages/Log_ProcessReport/Report_Service/ReportServiceTab'
  // 数据库审计报表
  import totalAudits from '@/pages/Log_DbAudit/DbAudit'
  import businessData from '@/pages/Log_OperationData/OperationData'
  import dbaAuditTimeTrend from '@/pages/Log_DbAudits/DbAudits'
  import dbaOperationCount from '@/pages/Log_DbOperate/DbOperate'
  import dbaBehaviorStatistic from '@/pages/Log_DbBehavior/DbBehavior'
  import dbaCustom from './Report_Custom/ReportCustomTab'
  // 自动化运维报表
  import autoOperScript from '@/pages/AutoOps_ConfigCollect/ScriptAudit'
  import autoOperFileDistribution from '@/pages/AutoOps_ConfigCollect/FileDistribution'
  // 安全通报报表
  import OtherSafeType from '@/pages/Log_ProcessReport/Safe_Bulletin/LogCenterOtherSafeType'
  import SafeAll from '@/pages/Log_ProcessReport/Safe_Bulletin/LogCenterSafeAll'
  import navs from '@/components/navButton/NavButton.vue';
  export default {
    data() {
      return {
        isShow: false,
        currentView: 'accountStatusCount',
        currentData: [],
        activeOpen: '', // 默认展开项
        safeTaskUuid: '',
        currentUuid: '',
        reportData: {}
      }
    },
    components: {
      accountStatusCount,
      assetTypeAndStatus,
      eventLevelCount,
      alarmEvents,
      systemgeneral,
      reportlevel,
      userClassify,
      ipamLog,
      accountUsage,
      userOnline,
      monitorNature,
      itcompMonitorTopN,
      itcompMonitorAva,
      operationworkloadCount,
      operationBlockingCount,
      focusAuditsCount,
      operationCount,
      assetAccountCount,
      collectAndModityPw,
      simeLogOverview,
      simeLog,
      simeLogReport,
      simeLogStrategy,
      simeLogEvent,
      simeLevelProtect,
      simePotentialDangerous,
      itilIncident,
      itilProblem,
      itilChange,
      itilPublish,
      itilKnowledge,
      itilRequest,
      totalAudits,
      businessData,
      dbaAuditTimeTrend,
      dbaOperationCount,
      dbaBehaviorStatistic,
      autoOperScript,
      autoOperFileDistribution,
      navs,
      OtherSafeType,
      SafeAll,
      dbaCustom
    },
    created() {
      // 从资产管理-》IPAM-》概览图-》IP地址状态变更TOP 10右上角跳转而来，进入IP地址变更统计，筛选变更类型为“状态变更”
      this.status = this.$route.query.status; // src\pages\Assets_Ipam\IpamOverview.vue
      if (this.status === 'ZTBG' || this.status === 'GLZCBG') {
        this.currentView = 'ipamLog';
      }
      let vm = this
      $axios.get('logCenterIndex/reportClassify').then(res => {
        vm.isShow = true
        vm.activeOpen = res.data[0].uuid
        vm.currentUuid = res.data[0].childrenList[0].uuid
        if (vm.status === 'ZTBG' || vm.status === 'GLZCBG') {
          let arr = res.data[0].childrenList.filter(item => item.name === 'IP台账');
          if (arr.length) {
            vm.currentUuid = arr[0].uuid
          }
        }
        vm.currentData = res.data
      })
    },
    methods: {
      selection(key) {
        // this.currentView = key
      },
      selectionAll(key) {
      },
      changeUuid(item1, key, val) {
        this.currentUuid = key
        this.currentView = val
        this.reportData = item1
        this.safeTaskUuid = key
      }
    }
  }
</script>
<style lang="stylus">
  .left-menu-box
    margin-left -20px
    .s-menu-submenu-title,.s-menu-item
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
