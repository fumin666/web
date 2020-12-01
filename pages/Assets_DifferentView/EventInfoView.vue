/**
* Created by dgunzi on 2019/02/20.
* 事件信息视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content" style="padding:5px 10px;">
          <s-tab v-model="activeTab" type="card" key="tab1">
            <!--最新事件-->
            <s-tab-pane label="最新事件" name="0">
              <latest-events v-if="activeTab === '0'" :uuid="assetUuid"></latest-events>
            </s-tab-pane>
            <!--关联规则-->
            <s-tab-pane label="关联规则" name="1">
              <association-rules v-if="activeTab === '1'" :uuid="assetUuid"></association-rules>
            </s-tab-pane>
          </s-tab>
          <event-level-chart></event-level-chart>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import AssociationRules from './RecordList/AssociationRules.vue';
  import LatestEvents from './RecordList/LatestEvents.vue';
  import EventLevelChart from './common_components/EventLevelChart.vue';

  export default {
    name: 'EventInfoView',
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid,
        activeTab: '0'
      }
    },
    created() {
    },
    methods: {},
    components: {
      LatestEvents,
      EventLevelChart,
      AssetDetailConstructor,
      AssociationRules
    }
  }
</script>

<style scoped>

</style>
