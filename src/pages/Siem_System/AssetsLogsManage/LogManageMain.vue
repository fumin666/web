<template>
  <div class="assetAudit">
    <s-tab v-model="activeTab">
      <s-tab-pane label="日志源配置" name="pane1" v-if="judgeRoleBtn('assetsManage_logSourceConfiguration')">
        <source-config v-if="activeTab === 'pane1'"></source-config>
      </s-tab-pane>
      <s-tab-pane label="应用类别配置" name="pane2" v-if="judgeRoleBtn('assetsManage_applyCategoryConf')">
        <category-config v-if="activeTab === 'pane2'"></category-config>
      </s-tab-pane>
      <s-tab-pane label="日志接收配置" name="pane3" v-if="judgeRoleBtn('assetsManage_logAcceptConf')">
        <accept-config v-if="activeTab === 'pane3'"></accept-config>
      </s-tab-pane>
      <s-tab-pane label="日志采集配置" name="pane4" v-if="judgeRoleBtn('assetsManage_logCollectConf')">
        <collect-config v-if="activeTab === 'pane4'"></collect-config>
      </s-tab-pane>
      <s-tab-pane label="日志转发配置" name="pane5" v-if="judgeRoleBtn('assetsManage_logForwardingConf')">
        <forward-config v-if="activeTab === 'pane5'"></forward-config>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import acceptConfig from './LogsManage'
  import collectConfig from './LogCollect'
  import forwardConfig from './LogForwarding'
  import categoryConfig from './LogCategory'
  import sourceConfig from './LogSource'
  export default {
    data() {
      return {
        tabNameArr: ['assetsManage_logSourceConfiguration', 'assetsManage_applyCategoryConf', 'assetsManage_logAcceptConf', 'assetsManage_logCollectConf', 'assetsManage_logForwardingConf'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    components: {
      acceptConfig,
      collectConfig,
      forwardConfig,
      categoryConfig,
      sourceConfig
    }
  }
</script>
