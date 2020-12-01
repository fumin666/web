/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-发布流程报表.
*/

<template>
  <div style="margin: 20px 0 20px 5px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="发布管理详细信息" name="pane1" v-if="judgeRoleBtn('logCenter_publishDetails')">
        <release-details v-if="activeTab === 'pane1'"></release-details>
      </s-tab-pane>
      <s-tab-pane label="发布管理平均处理时长" name="pane2" v-if="judgeRoleBtn('logCenter_publishDealTime')">
        <release-deal v-if="activeTab === 'pane2'"></release-deal>
      </s-tab-pane>
      <s-tab-pane label="发布管理趋势分析" name="pane3" v-if="judgeRoleBtn('logCenter_publishManage')">
        <release-Trend v-if="activeTab === 'pane3'"></release-Trend>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import ReleaseDetails from './ReleaseDetails'
  import ReleaseDeal from './ReleaseDeal'
  import ReleaseTrend from './ReleaseTrend'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_publishDetails', 'logCenter_publishDealTime', 'logCenter_publishManage'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      ReleaseDetails,
      ReleaseDeal,
      ReleaseTrend
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
