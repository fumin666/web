<template>
  <!--自定义首页 流程设置-->
  <div class="diy-process-setUp">
    <s-card-diy
      title="流程配置"
      :show-more="false"
      show-scrollbar
    >
      <ProcessSetUp></ProcessSetUp>
    </s-card-diy>
  </div>
</template>

<script>
  import ProcessSetUp from '@/pages/Process_SetUp/ProcessSetUp.vue';

  export default {
    name: 'process-setUp',

    components: {
      ProcessSetUp
    }
  }
</script>
