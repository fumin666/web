/**
* Created by liushupeng on 2019/2/21.
*/
<template>
  <section id="eventContent">
    <s-tab @on-click="tabClick" key="tab2" v-model="activeTab2">
      <s-tab-pane label="监控事件" :vif="IMP" name="IMP">
        <event-monitor v-if="activeTab2 === 'IMP'"></event-monitor>
      </s-tab-pane>
      <s-tab-pane label="运维审计事件" :vif="OMA" name="OMA">
        <event-operation v-if="activeTab2 === 'OMA'"></event-operation>
      </s-tab-pane>
      <s-tab-pane label="登录重要资产事件" :vif="OMA" name="OMA1">
        <event-import v-if="activeTab2 === 'OMA1'"></event-import>
      </s-tab-pane>
      <s-tab-pane label="数据库审计事件" :vif="DBA" name="DBA">
        <event-db v-if="activeTab2 === 'DBA'"></event-db>
      </s-tab-pane>
      <s-tab-pane label="业务审计事件" :vif="DBA"  name="DBA1">
        <event-business v-if="activeTab2 === 'DBA1'"></event-business>
      </s-tab-pane>
      <s-tab-pane label="日志审计事件" :vif="SIEM" name="SIEM">
        <event-log v-if="activeTab2 === 'SIEM'"></event-log>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import EventMonitor from '../Event_List/EventMonitor'
  import EventOperation from '../Event_List/EventOperation'
  import EventDb from '../Event_List/EventDb'
  import EventImport from '../../Event_List/ImportAsset'
  import EventBusiness from '../Event_List/EventBusiness'
  import EventLog from '../Event_List/EventlogAudit'
  export default {
    data() {
      return {
        activeTab2: 'IMP',
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
      EventImport
    },
    methods: {
      tabClick(val) {
        if (val === 'DBA1') {
          this.activeTab2 = 'DBA1'
        } else {
          this.activeTab2 = val
        }
      }
    },
    created() {
      // 判断系统注册模块，选择哪些tab要展示
      let registerModelList = this.$store.state.userData.registerModelList;
      for (let i = 0; i < registerModelList.length; i++) {
        if (['IMP', 'OMA', 'DBA', 'SIEM'].indexOf(registerModelList[i]) > -1) {
          this[registerModelList[i]] = true;
        }
      }
      if (this.IMP) {
        this.activeTab2 = 'IMP'
        return false
      }
      if (this.OMA) {
        this.activeTab2 = 'OMA'
        return false
      }
      if (this.DBA) {
        this.activeTab2 = 'DBA'
        return false
      }
      if (this.SIEM) {
        this.activeTab2 = 'SIEM'
        return false
      }
    }
  }
</script>
