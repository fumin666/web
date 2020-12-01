<template>
  <section>
    <s-tab type="card" v-model="activeTab" style="margin: 20px">
      <s-tab-pane label="稽核任务" name="pane1" v-if="judgeRoleBtn('accountManage_collectionTask')">
        <timing-audit v-if="activeTab === 'pane1'"></timing-audit>
      </s-tab-pane>
      <s-tab-pane label="稽核结果" name="pane2" v-if="judgeRoleBtn('accountManage_collectionResult')">
        <audit-result v-if="activeTab === 'pane2'"></audit-result>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import TimingAudit from '@/pages/Account_Audit/TimingAudit';
  import AuditResult from '@/pages/Account_Audit/AuditResult';

  export default {
    data() {
      return {
        tabNameArr: ['accountManage_collectionTask', 'accountManage_collectionResult'], // 页签名字的集合
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    components: {
      TimingAudit,
      AuditResult
    }
  }
</script>

<style lang="stylus">
</style>

