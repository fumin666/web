<template>
  <section class="log-alarm-more content">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="命令设置" name="pane1" v-if="judgeRoleBtn('logCenter_importantCmdSet')">
        <import-set v-if="activeTab === 'pane1'"></import-set>
      </s-tab-pane>
      <s-tab-pane label="命令集设置" name="pane2" v-if="judgeRoleBtn('logCenter_cmdGroupSet')">
        <gather-set v-if="activeTab === 'pane2'"></gather-set>
      </s-tab-pane>
      <s-tab-pane label="重点命令集统计" name="pane3" v-if="judgeRoleBtn('logCenter_importantCmdGroup')">
        <import-statics v-if="activeTab === 'pane3'"></import-statics>
      </s-tab-pane>
      <s-tab-pane label="用户命令集统计" name="pane4" v-if="judgeRoleBtn('logCenter_userCmdGroup')">
        <user-gather-set v-if="activeTab === 'pane4'"></user-gather-set>
      </s-tab-pane>
      <s-tab-pane label="命令集命令统计" name="pane5" v-if="judgeRoleBtn('logCenter_cmdCmdGroup')">
        <order-gather-set v-if="activeTab === 'pane5'"></order-gather-set>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  import ImportSet from './ImportSet.vue'
  import GatherSet from './GatherSet.vue'
  import ImportStatics from '../Log_ImportOrder/ImportOrder.vue'
  import UserGatherSet from './UserGatherSet.vue'
  import OrderGatherSet from './OrderGatherSet.vue'
  export default {
    components: {
      ImportSet,
      GatherSet,
      ImportStatics,
      UserGatherSet,
      OrderGatherSet
    },
    data() {
      return {
        tabNameArr: [
          'logCenter_importantCmdSet',
          'logCenter_cmdGroupSet',
          'logCenter_importantCmdGroup',
          'logCenter_userCmdGroup',
          'logCenter_cmdCmdGroup'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        orderList: []
      }
    },
    methods: {
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      // this.showList()
    }
  }
</script>

<style>
  .log-alarm-more {
    margin-top: 20px;
  }
</style>
