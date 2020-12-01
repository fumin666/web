<template>
  <!--资产健康性检查-->
  <div class="diy-assets-health-check">
    <s-card-diy
      title="资产健康性检查"
      :show-more="false"
      show-scrollbar>
      <assets-health-check></assets-health-check>
    </s-card-diy>
  </div>
</template>

<script>
    import AssetsHealthCheck from '@/pages/Assets_HealthCheck/AssetsHealthCheck';
    export default {
      components: {
        AssetsHealthCheck
      }
    }
</script>
