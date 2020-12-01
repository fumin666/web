<!--
 * @Author: alex
 * @Date: 2017-08-31
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-22 11:20:18
 * @Description: 初版为只支持win客户端，后续版本支持linux 和macos
 -->

<template>
  <section class="ope-client-global-set">
    <s-tab v-model="activeTab">
      <s-tab-pane label="Windows 客户端">
        <ClientGlobalSetTable v-if="activeTab === 0" :selectedIndex="activeTab"></ClientGlobalSetTable>
      </s-tab-pane>
      <s-tab-pane label="Linux 客户端">
        <ClientGlobalSetTable v-if="activeTab === 1" :selectedIndex="activeTab"></ClientGlobalSetTable>
      </s-tab-pane>
      <s-tab-pane label="Mac OS 客户端">
        <ClientGlobalSetTable v-if="activeTab === 2" :selectedIndex="activeTab"></ClientGlobalSetTable>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
import ClientGlobalSetTable from './components/ClientGlobalSetTable.vue';

export default {
  components: {
    ClientGlobalSetTable  // 表格
  },
  data() {
    return {
      activeTab: 0
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.ope-client-global-set {
  /*margin: 15px;*/
}
</style>
