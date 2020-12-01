<template>
  <!--命令集管理-->
  <div class="diy-event-cmd">
    <s-card-diy
      title="命令集管理"
      :show-more="false"
      show-scrollbar>
      <event-cmd></event-cmd>
    </s-card-diy>
  </div>
</template>

<script>
  import EventCmd from '@/pages/Event_Cmd/Cmd';

  export default {
    components: {
      EventCmd
    }
  }
</script>
