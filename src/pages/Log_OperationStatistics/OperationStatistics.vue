<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:20:19
 * @LastEditTime: 2019-08-12 13:34:05
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section class="log-alarm-more operationStatics content">
    <s-button class="client-download-btn" icon="download" title="审核客户端下载" @click="downloadDialogShow">审核客户端下载</s-button>
    <!--下载客户端-->
    <s-dialog
      v-model="downloadDialog"
      v-if="downloadDialog"
      width="900px"
      title="客户端下载">
      <download-dialog :auditShow="auditShow"></download-dialog>
    </s-dialog>
    <s-tab type="card"  @on-click="showTab">
      <s-tab-pane label="会话审核" v-if="judgeRoleBtn('logCenter_operAuditSessionAudit')">
        <audit :show1="show1"></audit>
      </s-tab-pane>
      <s-tab-pane label="会话查询" v-if="judgeRoleBtn('logCenter_operAuditSessionView')">
        <search :show2="show2"></search>
      </s-tab-pane>
      <s-tab-pane label="阻断命令统计" v-if="judgeRoleBtn('logCenter_operAuditInterdictCmd')">
        <command :show3="show3"></command>
      </s-tab-pane>
      <s-tab-pane label="智能审计评分" v-if="judgeRoleBtn('logCenter_operAuditIntelligentAudit')">
        <intelligent-audit :show4="show4"></intelligent-audit>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import Audit from './Audit'
  import Search from './Search'
  import command from './OperationBlock'
  import intelligentAudit from './IntelligentAudit'
  import downloadDialog from '@/pages/Operation_ClientDownLoad/Download'
  export default{
    components: {
      Audit,
      Search,
      command,
      downloadDialog,
      intelligentAudit
    },
    data() {
      return {
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        downloadDialog: false,
        auditShow: false
      }
    },
    created() {
    },
    props: [],
    methods: {
      showTab(val) {
        let vm = this;
        let vals = 1 + Number(val);
        vm.show1 = false;
        vm.show2 = false;
        vm.show3 = false;
        vm.show4 = false;
        this['show' + vals] = true;
      },
      downloadDialogShow() {
        this.downloadDialog = true
      }
    }
  }
</script>
<style scoped>
  .log-alarm-more{
    position: relative;
  }
  .log-alarm-more .client-download-btn{
    position: absolute;
    right: 0;
    z-index: 1000;
  }
</style>
