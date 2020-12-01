/**
* Created by dgunzi on 2019/02/20.
* 运维视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <s-tab v-model="activeTab" type="card" key="tab1" style="min-height: 500px;">
            <!--运维记录-->
            <s-tab-pane label="运维记录" name="0">
              <operation-record v-if="activeTab === '0'" :uuid="assetUuid"></operation-record>
            </s-tab-pane>
            <!--可使用账号-->
            <s-tab-pane label="可使用账号" name="1">
              <available-account v-if="activeTab === '1'" :uuid="assetUuid"></available-account>
            </s-tab-pane>
          </s-tab>
          <div style="display: flex;justify-content: flex-start;">
            <current-week-audit-chart style="flex: 1;" :uuid="assetUuid"></current-week-audit-chart>
            <current-week-op-chart style="flex: 2" :uuid="assetUuid"></current-week-op-chart>
          </div>
        </div>
      </AssetDetailConstructor>
   </div>
 </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import CurrentWeekOpChart from './common_components/CurrentWeekOpChart.vue';
  import currentWeekAuditChart from './common_components/CurrentWeekAuditChart.vue';
  import OperationRecord from './RecordList/OperationRecord'; // 运维记录
  import AvailableAccount from './RecordList/AvailableAccount.vue'; // 可使用账号

  export default {
       name: 'OperationCenterView',
       data() {
         return {
           /* 基础信息参数 */
           assetUuid: this.$route.params.assetUuid,
           activeTab: '0',
           currentView: 'AssetsOverview'
         }
       },
       created() {
       },
       components: {
         AssetDetailConstructor,
         OperationRecord,
         AvailableAccount,
         currentWeekAuditChart,
         CurrentWeekOpChart
       },
       methods: {
       }
   }
</script>

