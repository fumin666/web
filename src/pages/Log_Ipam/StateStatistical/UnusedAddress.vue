<!--
 * @Description: 未用的IP地址统计
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-22 10:17:15
 * @LastEditTime: 2019-05-29 10:42:55
 -->

<template>
  <div>
    <s-tab v-model="activeTab">
      <s-tab-pane label="子网视角" name="pane1">
        <Unused-address-subnet v-if="activeTab === 'pane1'" @skipTotab2="skipTotab2"></Unused-address-subnet>
      </s-tab-pane>
      <s-tab-pane label="IP地址视角" name="pane2">
        <Unused-Address-Ip v-if="activeTab === 'pane2'" :subnetobj="subnetobj"></Unused-Address-Ip>
      </s-tab-pane>
  </s-tab>
  </div>
</template>

<script>
import UnusedAddressSubnet from './UnusedAddress/UnusedAddressSubnet'
import UnusedAddressIp from './UnusedAddress/UnusedAddressIp'
 export default {
   data() {
     return {
       activeTab: 'pane1',
       subnetobj: {}
     }
   },
   components: {
     UnusedAddressSubnet,
     UnusedAddressIp
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
