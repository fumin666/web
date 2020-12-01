<template>
  <!--系统配置（资产）-->
  <div class="diy-asset-setting">
    <s-card-diy
      title="参数配置"
      :show-more="false"
      show-scrollbar>
      <asset-setting></asset-setting>
    </s-card-diy>
  </div>
</template>

<script>
  import AssetSetting from '@/pages/Assets_Setting/AssetSetting';

  export default {
    components: {
      AssetSetting
    }
  }
</script>
