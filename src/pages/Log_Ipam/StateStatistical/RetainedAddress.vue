<!--
 * @Description: 保留的IP地址状态统计
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-22 11:05:00
 * @LastEditTime: 2019-05-29 10:43:03
 -->

<template>
  <div>
    <s-tab v-model="activeTab">
      <s-tab-pane label="子网视角" name="pane1">
        <Retained-address-subnet v-if="activeTab === 'pane1'" @skipTotab2="skipTotab2"></Retained-address-subnet>
      </s-tab-pane>
      <s-tab-pane label="IP地址视角" name="pane2">
        <Retained-Address-Ip v-if="activeTab === 'pane2'" :subnetobj="subnetobj"></Retained-Address-Ip>
      </s-tab-pane>
  </s-tab>
  </div>
</template>

<script>
import RetainedAddressSubnet from './RetainedAddress/RetainedAddressSubnet'
import RetainedAddressIp from './RetainedAddress/RetainedAddressIp'
 export default {
   data() {
     return {
       activeTab: 'pane1',
       subnetobj: {}
     }
   },
   components: {
     RetainedAddressSubnet,
     RetainedAddressIp
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
