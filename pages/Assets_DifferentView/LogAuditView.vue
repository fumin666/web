/**
* Created by dgunzi on 2019/02/20.
* 日志审计视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <log-info :uuid="assetUuid"></log-info>
          <total-num-of-log-week-chart></total-num-of-log-week-chart>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import TotalNumOfLogWeekChart from './common_components/TotalNumOfLogWeekChart.vue';
  import LogInfo from './RecordList/LogInfo.vue';
  export default {
    name: 'SIEMView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid
      }
    },
    methods: {},
    components: {
      TotalNumOfLogWeekChart,
      LogInfo,
      AssetDetailConstructor
    }
  }
</script>

<style scoped>

</style>
