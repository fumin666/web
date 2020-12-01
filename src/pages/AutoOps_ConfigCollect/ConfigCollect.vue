<template>
  <section id="auto-ops-collect-menu" class="content">
    <s-tab type="card" v-model="activeName">
      <s-tab-pane label="采集任务" name="collect_task">
        <collect-task></collect-task>
      </s-tab-pane>
      <s-tab-pane label="报表" name="collect_statement">
        <collect-statement></collect-statement>
      </s-tab-pane>
      <s-tab-pane label="采集配置" name="collect_config" v-if="showAuto">
        <collect-config></collect-config>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import CollectConfig from '@/pages/AutoOps_ConfigCollect/AdminConfig.vue'
  import CollectTask from '@/pages/AutoOps_ConfigCollect/CollectTask.vue'
  import CollectStatement from '@/pages/AutoOps_ConfigCollect/CollectStatement.vue'
  export default {
    data() {
      return {
        showAuto: true,
        tabIndex: 0,
        activeName: 'collect_task'
      }
    },
    components: {
      CollectConfig,
      CollectTask,
      CollectStatement
    },
    created() {
      this.tabIndex = this.$router.currentRoute.meta.index
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('AUTO') === -1) {
        this.showAuto = this.judgeRoleBtn('assetsManage_CollectionSet')
      }
    },
    methods: {
    }
  }
</script>
