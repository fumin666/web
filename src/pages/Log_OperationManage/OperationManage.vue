<template>
  <section class="log-alarm-more operationStatics content">
    <s-tab type="card"  @on-click="showTab">
      <s-tab-pane label="资产访问量统计" v-if="judgeRoleBtn('logCenter_operManageAssetVisit')">
        <assets :show1="show1"></assets>
      </s-tab-pane>
      <s-tab-pane label="运维统计报表" v-if="judgeRoleBtn('logCenter_operManageOperation')">
        <operations :show2="show2"></operations>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import Assets from './Assets'
  import Operations from './Operations'
  export default{
    components: {
      Assets,
      Operations
    },
    data() {
      return {
        show1: false,
        show2: false
      }
    },
    methods: {
      showTab(val) {
        let vm = this;
        let vals = 1 + Number(val);
        vm.show1 = false;
        vm.show2 = false;
        this['show' + vals] = true;
      }
    }
  }
</script>
