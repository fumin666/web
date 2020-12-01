<!--
 * @Description: 网络设备配置管理
 * @Author: songyf
 * @Date: 2020-4-14
 * @LastEditTime : 2020-4-14
 * @LastEditors  : LaMando
 -->
<template>
  <div class="net-device-config">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="配置文件管理" name="pane1">
        <config-file v-if="activeTab === 'pane1'"></config-file>
      </s-tab-pane>
      <s-tab-pane label="备份任务管理" name="pane2">
        <backup-task v-if="activeTab === 'pane2'"></backup-task>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import configFile from './ConfigFile'
  import backupTask from './BackupTask'
  export default {
    data() {
      return {
        activeTab: 'pane1'
      }
    },
    components: {
      configFile,
      backupTask
    },
    created() {
    }
  }
</script>
<style lang="stylus">
  .net-device-config
    margin 20px 0
</style>
