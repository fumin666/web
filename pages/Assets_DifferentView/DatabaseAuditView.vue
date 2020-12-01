/**
* Created by dgunzi on 2019/02/20.
* 数据库审计视角//Q4高级搜索优化
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <!--审计记录(数据库资产)-->
          <audit-record v-if="type === 'DatabaseAsset'" :uuid="assetUuid"></audit-record>
          <!--审计记录(中间件资产)-->
          <middleware-audit-record v-else-if="type === 'MiddleWareAsset'" :uuid="assetUuid" ></middleware-audit-record>
          <total-num-of-week-chart></total-num-of-week-chart>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import TotalNumOfWeekChart from './common_components/TotalNumOfWeekChart'
  import AuditRecord from './RecordList/AuditRecord.vue'; // 审计记录（数据库资产）
  import MiddlewareAuditRecord from './RecordList/MiddlewareAuditRecord.vue'; // 审计记录(中间件资产)
  export default {
    name: 'DatabaseAuditView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid,
        type: this.$route.params.type
      }
    },
    created() {
//      this.axiosCitypeTree()
    },
    methods: {},
    components: {
      AssetDetailConstructor,
      TotalNumOfWeekChart,
      AuditRecord,
      MiddlewareAuditRecord
    }
  }
</script>

<style scoped>

</style>
