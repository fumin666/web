<template>
  <section id="eventContent" class="login-set">
    <s-tab type="card"
      @on-click="tabClick"
           v-model="activeTab">
      <s-tab-pane label="监控事件" :vif="IMP || judgeRoleBtn('gradeProtect_rsMonitorEvent')" name="IMP">
        <event-monitor v-if="activeTab === 'IMP'"></event-monitor>
      </s-tab-pane>
      <s-tab-pane label="运维审计事件" :vif="OMA || judgeRoleBtn('gradeProtect_rsOperationAudit')" name="OMA">
        <event-operation v-if="activeTab === 'OMA'"></event-operation>
      </s-tab-pane>
      <s-tab-pane label="登录重要资产事件" :vif="OMA || judgeRoleBtn('gradeProtect_rsImportantAsset')" name="IMPO">
        <event-importasset v-if="activeTab === 'IMPO'"></event-importasset>
      </s-tab-pane>
      <s-tab-pane label="数据库审计事件" :vif="DBA || judgeRoleBtn('gradeProtect_rsDBAudit')" name="DBA">
        <event-db v-if="activeTab === 'DBA'"></event-db>
      </s-tab-pane>
      <s-tab-pane label="业务审计事件" :vif="DBA || judgeRoleBtn('gradeProtect_rsBussinessAudit')"  name="DBA1">
        <event-business v-if="activeTab === 'DBA1'"></event-business>
      </s-tab-pane>
      <s-tab-pane label="日志审计事件" :vif="SIEM || judgeRoleBtn('gradeProtect_rsLogAudit')" name="SIEM">
        <event-log v-if="activeTab === 'SIEM'"></event-log>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import EventMonitor from './Monitor'
  import EventOperation from './Operation'
  import EventImportasset from './ImportAsset'
  import EventDb from './Db'
  import EventBusiness from './Business'
  import EventLog from '@/pages/Siem_System/EventRules/EventlogAudit'
  export default {
    data() {
      return {
        activeTab: 'IMP',
        IMP: false,
        OMA: false,
        DBA: false,
        SIEM: false
      }
    },
    components: {
      EventMonitor,
      EventOperation,
      EventDb,
      EventBusiness,
      EventLog,
      EventImportasset
    },
    methods: {
      tabClick(val) {
        if (val === 'DBA1') {
          this.activeTab = 'DBA1'
        } else if (val === 'IMPO') {
          this.activeTab = 'IMPO'
        } else {
          this.activeTab = val
        }
      }
    },
    created() {
      if (this.$route.params.tab === '0') {
        let registerModelList = this.$store.state.userData.registerModelList;
        for (let i = 0; i < registerModelList.length; i++) {
          if (['IMP', 'OMA', 'DBA', 'SIEM'].indexOf(registerModelList[i]) > -1) {
            this[registerModelList[i]] = true;
          }
        }
        if (this.IMP) {
          this.activeTab = 'IMP'
          return false
        }
        if (this.OMA) {
          this.activeTab = 'OMA'
          return false
        }
        if (this.DBA) {
          this.activeTab = 'DBA'
          return false
        }
        if (this.SIEM) {
          this.activeTab = 'SIEM'
          return false
        }
      } else if (this.$route.params.tab === undefined) {
        let registerModelList = this.$store.state.userData.registerModelList;
        for (let i = 0; i < registerModelList.length; i++) {
          if (['IMP', 'OMA', 'DBA', 'SIEM'].indexOf(registerModelList[i]) > -1) {
            this[registerModelList[i]] = true;
          }
        }
        if (this.IMP) {
          this.activeTab = 'IMP'
          return false
        }
        if (this.OMA) {
          this.activeTab = 'OMA'
          return false
        }
        if (this.DBA) {
          this.activeTab = 'DBA'
          return false
        }
        if (this.SIEM) {
          this.activeTab = 'SIEM'
          return false
        }
      } else {
        this.activeTab = this.$route.params.tab
        return false
      }
    }
  }
</script>
