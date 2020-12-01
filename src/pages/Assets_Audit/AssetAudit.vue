<template>
  <div class="assetAudit">
    <s-tab v-model="activeTab">
      <s-tab-pane label="数据库配置" name="pane1" v-if="judgeRoleBtn('assetsManage_databaseConfiguration')">
        <db-tab ref="db" v-if="activeTab === 'pane1'"></db-tab>
      </s-tab-pane>
      <s-tab-pane label="中间件系统配置" name="pane2" v-if="judgeRoleBtn('assetsManage_middlewareSystemConf')">
        <server-tab ref="server" v-if="activeTab === 'pane2'"></server-tab>
      </s-tab-pane>
      <s-tab-pane label="智能免审计配置" name="pane3" v-if="judgeRoleBtn('assetsManage_smartAuditFree')">
        <interlligent-tab v-if="activeTab === 'pane3'"></interlligent-tab>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import dbTab from './DbTab';
  import serverTab from './ServerTab';
  import interlligentTab from './InterlligentTab';

  export default {
    data() {
      return {
        tabNameArr: ['assetsManage_databaseConfiguration', 'assetsManage_middlewareSystemConf', 'assetsManage_smartAuditFree'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    components: {
      dbTab,
      serverTab,
      interlligentTab
    }
  }
</script>

<style lang="stylus">
  .assetAudit
    .auditScrollbar
    .topRow
      margin-bottom -36px
      margin-top 5px
</style>
