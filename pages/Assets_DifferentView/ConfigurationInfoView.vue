/**
* Created by dgunzi on 2019/02/20.
* 配置信息视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <config-change-detail ></config-change-detail>
          <!--资产生命周期-->
          <asset-life-cycle-time-line></asset-life-cycle-time-line>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import AssetLifeCycleTimeLine from './common_components/AssetLifeCycleTimeLine.vue';
  import ConfigChangeDetail from './RecordList/ConfigChangeDetail.vue';
  export default {
    name: 'ConfigurationInfoView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid
      }
    },
    created() {
    },
    components: {
      AssetDetailConstructor,
      AssetLifeCycleTimeLine,
      ConfigChangeDetail
    },
    methods: {}
  }
</script>

<style scoped>

</style>
