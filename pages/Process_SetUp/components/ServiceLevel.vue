<template>
  <div class="high-level-set" style="margin:20px 20px 0 20px;">
    <s-col :span="24">
      <service-level-agreement></service-level-agreement>
    </s-col>
  </div>
</template>

<script>
  import ServiceLevelAgreement from './ServiceLevelAgreement.vue';
    export default {
      components: {
        ServiceLevelAgreement
      }
    }
</script>

<style scoped>

</style>
