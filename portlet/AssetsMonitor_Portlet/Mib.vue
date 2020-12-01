<template>
  <!--MIB管理-->
  <div class="diy-monitor-mib">
    <s-card-diy show-scrollbar title="MIB工具" :show-more="false">
      <MonitorMib></MonitorMib>
    </s-card-diy>
  </div>
</template>

<script>
import MonitorMib from '@/pages/AssetsMonitor_MIB/MibLists'

export default {
  components: {
    MonitorMib
  }
}
</script>
