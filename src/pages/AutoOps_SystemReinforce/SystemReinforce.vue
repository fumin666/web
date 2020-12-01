<template>
  <section id="auto-ops-collect-menu" class="content">
    <s-tab type="card" v-model="activeName">
      <s-tab-pane label="模板配置" name="templateConfig">
        <template-config v-if="activeName === 'templateConfig'"></template-config>
      </s-tab-pane>
      <s-tab-pane label="任务执行" name="taskExecute">
        <task-execution v-if="activeName === 'taskExecute'"></task-execution>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import TemplateConfig from '@/pages/AutoOps_SystemReinforce/TemplateConfigNew.vue'
  import TaskExecution from '@/pages/AutoOps_SystemReinforce/TaskExecutionNew.vue'
  export default {
    data() {
      return {
        activeName: 'templateConfig'
      }
    },
    components: {
      TemplateConfig,
      TaskExecution
    },
    created() {
    },
    methods: {
    }
  }
</script>
