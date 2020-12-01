/**
* Created by dgunzi on 2019/02/20.
* 自动化运维
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <!--审计记录-->
          <script-operation-record :uuid="assetUuid"></script-operation-record>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import ScriptOperationRecord from './RecordList/ScriptOperationRecord.vue'; // 脚本运维记录
  export default {
    name: 'AutoOpsView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid
      }
    },
    methods: {},
    components: {
      AssetDetailConstructor,
      ScriptOperationRecord
    }
  }
</script>

<style scoped>

</style>
