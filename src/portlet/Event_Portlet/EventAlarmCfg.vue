<template>
  <!--告警方式配置-->
  <div class="diy-event-alarm-cfg">
    <s-card-diy
      title="告警方式配置"
      :show-more="false"
      show-scrollbar>
      <event-alarm></event-alarm>
    </s-card-diy>
  </div>
</template>

<script>
  import EventAlarm from '@/pages/Event_AlarmCfg/Alarm';

  export default {
    components: {
      EventAlarm
    }
  }
</script>
