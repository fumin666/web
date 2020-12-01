<template>
  <section class="content" style="margin-top: 20px;">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="DDL数量时间走势" name="pane1" v-if="judgeRoleBtn('logCenter_dbaAuditTimeTrendDDL')">
        <ddl-log v-if="activeTab === 'pane1'"></ddl-log>
      </s-tab-pane>
      <s-tab-pane label="DML数量时间走势" name="pane2" v-if="judgeRoleBtn('logCenter_dbaAuditTimeTrendDML')">
        <dml-log v-if="activeTab === 'pane2'"></dml-log>
      </s-tab-pane>
      <s-tab-pane label="审计记录数时间走势" name="pane3" v-if="judgeRoleBtn('logCenter_dbaAuditTimeTrendAuditTime')">
        <audit-records v-if="activeTab === 'pane3'"></audit-records>
      </s-tab-pane>
      <s-tab-pane label="数据库账号数量时间走势" name="pane4" v-if="judgeRoleBtn('logCenter_dbaAuditTimeTrendAccountCount')">
        <db-log v-if="activeTab === 'pane4'"></db-log>
      </s-tab-pane>
      <s-tab-pane label="告警时间统计" name="pane5" v-if="judgeRoleBtn('logCenter_dbaAuditTimeTrendAlarmTime')">
        <alarm-time v-if="activeTab === 'pane5'"></alarm-time>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';
  import dbLog from './DBlog'
  import ddlLog from './DDLlog'
  import dmlLog from './DMLlog'
  import alarmTime from './AlarmTime'
  import auditRecords from './AuditRecords'
  export default {
    data () {
      return {
        tabNameArr: ['logCenter_dbaAuditTimeTrendDDL', 'logCenter_dbaAuditTimeTrendDML', 'logCenter_dbaAuditTimeTrendAuditTime', 'logCenter_dbaAuditTimeTrendAccountCount', 'logCenter_dbaAuditTimeTrendAlarmTime'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      dbLog,
      ddlLog,
      dmlLog,
      alarmTime,
      auditRecords
    },
    methods: {
    },
    mounted() {
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
