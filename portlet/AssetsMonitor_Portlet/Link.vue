<template>
  <!--链路管理-->
  <div class="diy-monitor-link">
    <s-card-diy show-scrollbar title="链路管理" :show-more="false">
      <MonitorLink></MonitorLink>
    </s-card-diy>
  </div>
</template>

<script>
import MonitorLink from '@/pages/AssetsMonitor_TopologyManage/Link'

export default {
  components: {
    MonitorLink
  }
}
</script>
