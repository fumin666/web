<!--
 * @Description: In User Settings Edit
 * @Author: 仝希博
 * @LastEditors: mybells
 * @Date: 2019-04-19 13:26:57
 * @LastEditTime: 2019-12-09 10:41:28
 -->

<template>
  <section class="event-rules">
    <s-tab type="card" v-model="activeTab">
        <s-tab-pane label="未使用的IP地址统计" name="pane1" v-if="judgeRoleBtn('logCenter_unusedIp')">
          <Unused-Address v-if="activeTab === 'pane1'"></Unused-Address>
        </s-tab-pane>
        <s-tab-pane label="保留的IP地址统计" name="pane2" v-if="judgeRoleBtn('logCenter_keepIp')">
          <Retained-Address v-if="activeTab === 'pane2'"></Retained-Address>
        </s-tab-pane>
        <s-tab-pane label="IP地址状态汇总统计" name="pane3" v-if="judgeRoleBtn('logCenter_ipAddressStatus')">
          <State-Summary v-if="activeTab === 'pane3'"></State-Summary>
        </s-tab-pane>
        <s-tab-pane label="IP地址变更统计" name="pane4" v-if="judgeRoleBtn('logCenter_ipAddressChange')">
          <Address-Change-Statistics v-if="activeTab === 'pane4'" :change-type="status"></Address-Change-Statistics>
        </s-tab-pane>
        <s-tab-pane label="IPAM操作统计" name="pane5" v-if="judgeRoleBtn('logCenter_ipOperationLog')">
          <Operating-Statistics v-if="activeTab === 'pane5'"></Operating-Statistics>
        </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import AddressChangeStatistics from './StateStatistical/AddressChangeStatistics.vue'
  import OperatingStatistics from './StateStatistical/OperatingStatistics.vue'
  import UnusedAddress from './StateStatistical/UnusedAddress.vue'
  import RetainedAddress from './StateStatistical/RetainedAddress.vue'
  import StateSummary from './StateStatistical/StateSummary.vue'
export default {
    data() {
        return {
          tabNameArr: ['logCenter_unusedIp', 'logCenter_keepIp', 'logCenter_ipAddressStatus', 'logCenter_ipAddressChange', 'logCenter_ipOperationLog'], // 页签名字的集合(顺序和页签一致)
          activeTab: 'pane1',
          status: ''
        }
    },
    components: {
      AddressChangeStatistics,
      OperatingStatistics,
      UnusedAddress,
      RetainedAddress,
      StateSummary
    },
    created() {
      // 从资产管理-》IPAM-》概览图-》IP地址状态变更TOP 10右上角跳转而来，进入IP地址变更统计，筛选变更类型为“状态变更”
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.status = this.$route.query.status; // src\pages\Assets_Ipam\IpamOverview.vue
      if (this.status === 'ZTBG' || this.status === 'GLZCBG') {
        this.activeTab = 'pane4';
      }
    }
}
</script>
<style>
  .event-rules {
    margin: 20px 0 20px 5px;
  }
</style>
