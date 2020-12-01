<template>
  <!--电视墙-->
  <div class="diy-monitor-tvwall">
    <s-card-diy show-scrollbar title="电视墙" :show-more="false">
      <MonitorTvwall></MonitorTvwall>
    </s-card-diy>
  </div>
</template>

<script>
import MonitorTvwall from '@/pages/AssetsMonitor_Tvwall/Index'

export default {
  components: {
    MonitorTvwall
  }
}
</script>
