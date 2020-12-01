<template>
  <div>
    <s-tab type="card" style="margin:20px">
      <s-tab-pane label="监控频率设置" name="pane1">
        <Monitoringfrequency v-if="activeTab === 'pane1'"></Monitoringfrequency>
      </s-tab-pane>
      <s-tab-pane label="可用性检测频率设置">
        <Usabilitytesting></Usabilitytesting>
      </s-tab-pane>
      <!-- <s-tab-pane label="监控模版管理" name="pane3">
        <Monitor-template v-if="activeTab === 'pane3'"></Monitor-template>
      </s-tab-pane> -->
    </s-tab>
  </div>
</template>
<script>
import Monitoringfrequency from './components/MonitoringFrequency.vue'
import Usabilitytesting from './components/UsabilityTesting.vue'
// import Monitortemplate from './components/MonitorTemplate.vue'
export default {
    components: {
      Monitoringfrequency,
      Usabilitytesting
      // Monitortemplate
    },
    data() {
      return {
        activeTab: 'pane1'
      }
    },
    created() {
    },
    methods: {
    }
}
</script>
