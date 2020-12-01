<!--
 * @Description: IP地址状态汇总统计
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-22 11:13:21
 * @LastEditTime: 2019-05-29 10:43:00
 -->

<template>
<div>
  <s-tab v-model="activeTab">
    <s-tab-pane label="子网视角" name="pane1">
      <Ipaddress v-if="activeTab === 'pane1'" @skipTotab2="skipTotab2"></Ipaddress>
    </s-tab-pane>
    <s-tab-pane label="IP地址视角" name="pane2">
      <Ip-Perspective v-if="activeTab === 'pane2'" :subnetobj="subnetobj"></Ip-Perspective>
    </s-tab-pane>
  </s-tab>
</div>
</template>

<script>
import Ipaddress from './IP_state/Ipaddress'
import IpPerspective from './IP_state/IpPerspective'
export default {
  components: {
    Ipaddress,
    IpPerspective
  },
  data() {
    return {
      subnetobj: {},
      activeTab: 'pane1'
    }
  },
  methods: {
    skipTotab2(row) {
      this.subnetobj = row;
      this.activeTab = 'pane2';
    }
  }
}
</script>

<style lang="stylus">

</style>
