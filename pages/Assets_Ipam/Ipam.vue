<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @Description: IP台账
 -->
<template>
<section class="assets_ipam">
  <!-- <s-tab type="card" v-model="activeTab" v-if="judgeRoleBtn('assetsManage_overviewFigure')">
    <s-tab-pane label="概览图" name="pane1"> -->
      <ipam-overview v-if="activeTab === 'pane1'&&judgeRoleBtn('assetsManage_overviewFigure')" @showModel="showModel"></ipam-overview>
    <!-- </s-tab-pane>
    <s-tab-pane label="IP地址管理" name="pane2" v-if="judgeRoleBtn('assetsManage_ipAddressManagement')"> -->
      <ipam-address-manage v-if="activeTab === 'pane2'&&judgeRoleBtn('assetsManage_ipAddressManagement')" @showModel="showModel"></ipam-address-manage>
    <!-- </s-tab-pane>
  </s-tab> -->
</section>
</template>

<script>
import IpamOverview from './IpamOverview.vue';
import IpamAddressManage from './IpamAddressManage.vue';
// import Bus from '@/plugins/eventBus'

export default {
  components: {
    IpamOverview,
    IpamAddressManage
  },

  data() {
    return {
      tabNameArr: ['assetsManage_overviewFigure', 'assetsManage_ipAddressManagement'], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1'
    }
  },
  created() {
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    let name = this.$store.state.assetsManage.subnetform;
    if (name === 'address') {
      this.activeTab = 'pane2';
    }
  },
  methods: {
    showModel(val) {
      if (val === 'graph') {
        this.activeTab = 'pane1';
      } else if (val === 'list') {
        this.activeTab = 'pane2';
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('setSubnetform', '')
  }
}
</script>

<style scoped>

</style>
