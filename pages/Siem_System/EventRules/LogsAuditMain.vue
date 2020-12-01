/**
* Created by alex on 2019/2/21.
*/
<template>
  <div class="assetAudit">
    <s-tab v-model="activeTab">
      <s-tab-pane label="事件规则" name="pane1" v-if="judgeRoleBtn('eventCenter_logAuditEventRule')">
        <log-audit v-if="activeTab === 'pane1'"></log-audit>
      </s-tab-pane>
      <s-tab-pane label="等级保护规则" name="pane2" v-if="judgeRoleBtn('eventCenter_logAuditLevelProtect')">
        <level-protect v-if="activeTab === 'pane2'"></level-protect>
      </s-tab-pane>
      <s-tab-pane label="潜在危害分析规则" name="pane3" v-if="judgeRoleBtn('eventCenter_logAuditDangerous')">
        <hard-analysis v-if="activeTab === 'pane3'"></hard-analysis>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import logAudit from './LogsAudit'
  import levelProtect from './LevelProtect'
  import hardAnalysis from './HazardAnalysis'
  export default {
    data() {
      return {
        tabNameArr: ['eventCenter_logAuditEventRule', 'eventCenter_logAuditLevelProtect', 'eventCenter_logAuditDangerous'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      logAudit,
      levelProtect,
      hardAnalysis
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>

