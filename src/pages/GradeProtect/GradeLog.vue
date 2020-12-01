/**
* Created by fumin on 2020/02/18.
* 等级保护-等保报表.
*/

<template>
  <section class="left-menu-box">
    <s-row>
      <s-col :span="4" style="margin-top: 15px;">
        <s-menu @on-select="selection"
                accordion :active-name="currentUuid"
                :open-names=[activeOpen]
                :active-key="currentUuid"
                style="font-size: 14px;"
                v-if="isShow">
          <s-submenu v-for="(item, index) in currentData" :key="index" :name="item.uuid">
            <template slot="title"><i :class="`iconfont icon-${item.node.icon}`"></i>{{item.name}}</template>
            <s-menu-item v-for="(item1, index1) in item.childrenList" @click.native="changeUuid(item1.uuid,item1.node.keyWord.split('_')[2])" :key="index1" :title="item1.name" :name="item1.node.uuid">
              <span class="menu-dot"></span>{{item1.name}}</s-menu-item>
          </s-submenu>
        </s-menu>
      </s-col>
      <s-col :span="20" style="padding-left: 10px;">
        <component :is="currentView" :safeTaskUuid='safeTaskUuid' :key='safeTaskUuid' :activeTab="currentView"></component>
      </s-col>
    </s-row>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';
  // 身份鉴别与访问控制
  import methodOfIdentityAuthentication from '@/pages/Log_LevelReport/Level_2'
  import accessControl from '@/pages/Log_LevelReport/Level_3'
  import itcompAccountChange from '@/pages/Log_LevelReport/Level_4'
  // 运维审计功能
  import useDangerousCmd from '@/pages/Log_LevelReport/Level_6'
  import sensitiveAccount from '@/pages/Log_LevelReport/Level_7'
  import assetOperationAndMaintenanceOperations from '@/pages/Log_LevelReport/Level_8'
  // 数据库审计功能
  import dbUserOperationAudit from '@/pages/Log_LevelReport/Level_9'
  import dbSensitiveAccount from '@/pages/Log_LevelReport/Level_10'
  import dbImportantCmd from '@/pages/Log_LevelReport/Level_11'
  import dbaDMLAudit from '@/pages/Log_LevelReport/Level_12'
  import dbaDDLAudit from '@/pages/Log_LevelReport/Level_13'
  import resourcesException from '@/pages/Log_LevelReport/Level_14'
  import dbaAuditAuthChange from '@/pages/Log_LevelReport/Level_5'
  import dbaAuditAll from '@/pages/Log_LevelReport/Level_17'
  // 事件故障
  import eventFailureStatistics from '@/pages/Log_LevelReport/Level_15'
  // 资产管理
  import assetImportance from '@/pages/Log_LevelReport/Level_16'
  // 安全审计
  import eventLevelCount from '@/pages/Log_EventAccount/EventAccount'
  import alarmEvents from '@/pages/Log_EventAlarm/EventAlarm'
  import systemgeneral from '@/pages/Log_SystemGeneral/SystemGeneral'
  // 日志审计报表
  import simeLogOverview from '@/pages/Siem_System/LogSiem/LogSummary'
  import simeLog from '@/pages/Siem_System/LogSiem/LogSiemMain'
  import simeLogReport from '@/pages/Siem_System/LogSiem/LogReport'
  import simeLogStrategy from '@/pages/Siem_System/LogSiem/LogStrategyReport'
  import simeLogEvent from '@/pages/Siem_System/LogSiem/LogEventReport'
  import simeLevelProtect from '@/pages/Siem_System/LogSiem/LevelProtectReport'
  import simePotentialDangerous from '@/pages/Siem_System/LogSiem/DamageReport'
  // 安全通报报表
  import work from '@/pages/Log_ProcessReport/Safe_Bulletin/LogCenterOtherSafeType'
  import navs from '@/components/navButton/NavButton.vue';
  export default {
    data() {
      return {
        isShow: false,
        currentView: 'methodOfIdentityAuthentication',
        currentData: [],
        safeTaskUuid: '',
        currentUuid: '',
        activeOpen: '' // 默认展开项
      }
    },
    components: {
      eventLevelCount,
      alarmEvents,
      systemgeneral,
      assetImportance,
      methodOfIdentityAuthentication,
      accessControl,
      itcompAccountChange,
      useDangerousCmd,
      sensitiveAccount,
      assetOperationAndMaintenanceOperations,
      dbUserOperationAudit,
      dbSensitiveAccount,
      dbImportantCmd,
      dbaDMLAudit,
      dbaDDLAudit,
      resourcesException,
      dbaAuditAuthChange,
      dbaAuditAll,
      eventFailureStatistics,
      simeLogOverview,
      simeLog,
      simeLogReport,
      simeLogStrategy,
      simeLogEvent,
      simeLevelProtect,
      simePotentialDangerous,
      work,
      navs
    },
    created() {
      let vm = this
      $axios.get('/gradeProtection/reportClassify').then(res => {
        vm.isShow = true
        vm.activeOpen = res.data[0].uuid
        this.currentUuid = res.data[0].childrenList[0] ? res.data[0].childrenList[0].uuid : ''
        vm.currentData = res.data
      })
    },
    methods: {
      selection(key) {
        // this.currentView = key
      },
      changeUuid(key, val) {
        this.currentUuid = key
        this.currentView = val
        this.safeTaskUuid = key
      }
    }
  }
</script>
<style lang="stylus">
  .left-menu-box
    margin-left -20px
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
