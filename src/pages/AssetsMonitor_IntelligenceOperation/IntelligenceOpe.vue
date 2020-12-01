/**
 * @author fumin
 * @date 2019/10/29
 * @Description: 智能运维
*/
<template>
  <div class="business-service">
    <s-tab type="card" @tab-click="doRouter" v-model="tab">
      <s-tab-pane label="智能运维中心" name="index">
        <business-index v-if="tab === 'index'"></business-index>
      </s-tab-pane>
      <s-tab-pane label="备注管理" name="define">
        <business-defin v-if="tab === 'define'"></business-defin>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import BusinessIndex from './BusinessIndex'
  import BusinessDefin from './BusinessDefin'
  export default {
    components: {
      BusinessIndex,
      BusinessDefin
    },
    data () {
      return {
        tab: 'index'
      }
    },
    mounted () {
    },
    computed: {},
    methods: {
      doRouter (tab) {}
    }
  };
</script>
