<template>
  <section class="content" style="margin-top: 20px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="资产告警报表" name="pane1" v-if="judgeRoleBtn('logCenter_assetAlarmReport') || judgeRoleBtn('gradeProtect_dbReport_assetAlarmReport')">
        <assets v-if="activeTab === 'pane1'"></assets>
      </s-tab-pane>
      <s-tab-pane label="运维告警报表" name="pane2" v-if="judgeRoleBtn('logCenter_operationAlarmReport') || judgeRoleBtn('gradeProtect_dbReport_operationAlarmReport')">
        <ops-alarm v-if="activeTab === 'pane2'"></ops-alarm>
      </s-tab-pane>
      <s-tab-pane label="登录重要资产告警报表" name="pane3" v-if="judgeRoleBtn('logCenter_loginImportantAssetAlerts') || judgeRoleBtn('gradeProtect_dbReport_loginImportantAssetAlerts')">
        <important-alarm v-if="activeTab === 'pane3'"></important-alarm>
      </s-tab-pane>
      <s-tab-pane label="数据库告警报表" name="pane4" v-if="judgeRoleBtn('logCenter_dbaAlarmReport') || judgeRoleBtn('gradeProtect_dbReport_dbaAlarmReport')">
        <data-base v-if="activeTab === 'pane4'"></data-base>
      </s-tab-pane>
      <s-tab-pane label="业务告警报表" name="pane5" v-if="judgeRoleBtn('logCenter_businessAlarmReport') || judgeRoleBtn('gradeProtect_dbReport_businessAlarmReport')">
        <business v-if="activeTab === 'pane5'"></business>
      </s-tab-pane>
      <s-tab-pane label="日志告警报表" name="pane6" v-if="judgeRoleBtn('logCenter_logAlarmReport') || judgeRoleBtn('gradeProtect_dbReport_logAlarmReport')">
        <log v-if="activeTab === 'pane6'"></log>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">

  import Business from './Business.vue'
  import Assets from './Assets.vue'
  import Log from './Log.vue'
  import dataBase from './Db.vue'
  import opsAlarm from './OpsAlarm.vue'
  import importantAlarm from './ImportantAlarm.vue'
  import authCheck from '@/common/mixins/auth.js'
  export default {
    mixins: [authCheck],
    data () {
      return {
        tabNameArr: [
          'logCenter_assetAlarmReport',
          'logCenter_operationAlarmReport',
          'logCenter_loginImportantAssetAlerts',
          'logCenter_dbaAlarmReport',
          'logCenter_businessAlarmReport',
          'logCenter_logAlarmReport'
        ], // 页签名字的集合(顺序和页签一致)
        tabNameArr1: [
          'gradeProtect_dbReport_assetAlarmReport',
          'gradeProtect_dbReport_operationAlarmReport',
          'gradeProtect_dbReport_loginImportantAssetAlerts',
          'gradeProtect_dbReport_dbaAlarmReport',
          'gradeProtect_dbReport_businessAlarmReport',
          'gradeProtect_dbReport_logAlarmReport'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      Business,
      Assets,
      Log,
      dataBase,
      opsAlarm,
      importantAlarm
    },
    methods: {
    },
    created() {
      let {path} = this.$route
      this.activeTab = path === '/GradeProtect/gradeProtect_dbReport' ? this.tabIndexName(this.tabNameArr1) : this.tabIndexName(this.tabNameArr)
    }
  }
</script>
