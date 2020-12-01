<template>
  <section>
    <s-tab type="card" class="audit-section">
      <s-tab-pane label="稽核任务">
        <timing-audit></timing-audit>
      </s-tab-pane>
      <s-tab-pane label="稽核结果">
        <audit-result></audit-result>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import TimingAudit from './TimingAudit';
  import AuditResult from './AuditResult';

  export default {
    components: {
      TimingAudit,
      AuditResult
    }
  }
</script>

<style lang="stylus">
  .audit-section
    margin 20px
</style>

