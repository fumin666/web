/**
* Created by dgunzi on 2019/02/20.
* 账号信息视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <s-tab v-model="activeTab" type="card">
            <!--资产账号-->
            <s-tab-pane label="资产账号" name="0">
              <asset-account v-if="activeTab === '0'" :uuid="assetUuid"></asset-account>
            </s-tab-pane>
            <!--账号改密-->
            <s-tab-pane label="账号改密" name="1">
              <account-modify v-if="activeTab === '1'" :uuid="assetUuid"></account-modify>
            </s-tab-pane>
          </s-tab>
          <!--账号状态统计-->
          <account-status-chart></account-status-chart>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import AccountModify from './RecordList/AccountModify.vue';
  import AssetAccount from './RecordList/AssetAccount.vue';
  import AccountStatusChart from './common_components/AccountStatusChart.vue'

  export default {
    name: 'AccountInfoView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid,
        activeTab: '0',
        currentView: 'AssetsOverview'
      }
    },
    components: {
      AccountStatusChart,
      AssetDetailConstructor,
      AssetAccount,
      AccountModify
    },
    created() {

    },
    methods: {}
  }
</script>

<style scoped>

</style>
