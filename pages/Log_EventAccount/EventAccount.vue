<template>
  <section class="content">
    <s-tab type="card" v-model="activeTab" style="margin-top: 20px;">
      <s-tab-pane label="监控事件报表" name="pane1" v-if="judgeRoleBtn('logCenter_monitorEvent') || judgeRoleBtn('eventCenter_monitorEvent') || judgeRoleBtn('gradeProtect_dbReport_monitorEvent')">
        <monitor v-if="activeTab === 'pane1'"></monitor>
      </s-tab-pane>
      <s-tab-pane label="运维审计事件报表" name="pane2" v-if="judgeRoleBtn('logCenter_operAuditEvent') || judgeRoleBtn('eventCenter_operAuditEvent') || judgeRoleBtn('gradeProtect_dbReport_operAuditEvent')">
        <ops-audit v-if="activeTab === 'pane2'"></ops-audit>
      </s-tab-pane>
      <s-tab-pane label="登录重要设备告警" name="pane3" v-if="judgeRoleBtn('logCenter_loginAlarmEvent') || judgeRoleBtn('eventCenter_loginAlarmEvent') || judgeRoleBtn('gradeProtect_dbReport_loginAlarmEvent')">
        <important-asset v-if="activeTab === 'pane3'"></important-asset>
      </s-tab-pane>
      <s-tab-pane label="业务审计事件报表" name="pane4" v-if="judgeRoleBtn('logCenter_businessAuditEvent') || judgeRoleBtn('eventCenter_businessAuditEvent') || judgeRoleBtn('gradeProtect_dbReport_businessAuditEvent')">
        <business v-if="activeTab === 'pane4'"></business>
      </s-tab-pane>
      <s-tab-pane label="数据库审计事件报表" name="pane5" v-if="judgeRoleBtn('logCenter_dbaAuditEvent') || judgeRoleBtn('eventCenter_dbaAuditEvent') || judgeRoleBtn('gradeProtect_dbReport_dbaAuditEvent')">
        <db v-if="activeTab === 'pane5'"></db>
      </s-tab-pane>
      <s-tab-pane label="日志审计事件报表" name="pane6" v-if="judgeRoleBtn('logCenter_logAudidtEvent') || judgeRoleBtn('eventCenter_logAudidtEvent') || judgeRoleBtn('gradeProtect_dbReport_logAuditEvent')">
        <log v-if="activeTab === 'pane6'"></log>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';
  import Monitor from './Monitor.vue'
  import Business from './BusinessAduit.vue'
  import Log from './LogAduit.vue'
  import Db from './DbAduit.vue'
  import OpsAudit from './OpsAudit'
  import ImportantAsset from './ImportantAsset'
  import authCheck from '@/common/mixins/auth.js'
  export default {
    mixins: [authCheck],
    data () {
      return {
        tabNameArr1: [ // 报表
          'logCenter_monitorEvent',
          'logCenter_operAuditEvent',
          'logCenter_loginAlarmEvent',
          'logCenter_businessAuditEvent',
          'logCenter_dbaAuditEvent',
          'logCenter_logAudidtEvent'
        ], // 页签名字的集合(顺序和页签一致)
        tabNameArr2: [ // 事件
          'eventCenter_monitorEvent',
          'eventCenter_operAuditEvent',
          'eventCenter_loginAlarmEvent',
          'eventCenter_businessAuditEvent',
          'eventCenter_dbaAuditEvent',
          'eventCenter_logAudidtEvent'
        ], // 页签名字的集合(顺序和页签一致)
        tabNameArr3: [ // 事件
          'gradeProtect_dbReport_monitorEvent',
          'gradeProtect_dbReport_operAuditEvent',
          'gradeProtect_dbReport_loginAlarmEvent',
          'gradeProtect_dbReport_businessAuditEvent',
          'gradeProtect_dbReport_dbaAuditEvent',
          'gradeProtect_dbReport_logAuditEvent'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      Monitor,
      Business,
      Log,
      Db,
      OpsAudit,
      ImportantAsset
    },
    methods: {
    },
    created() {
      let {path} = this.$route // 根据路由判断是报表还是事件
      this.activeTab = path === '/EventCenter/event_level' ? this.tabIndexName(this.tabNameArr2) : path === '/GradeProtect/gradeProtect_dbReport' ? this.tabIndexName(this.tabNameArr3) : this.tabIndexName(this.tabNameArr1)// 返回第一个为true页签的index
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
