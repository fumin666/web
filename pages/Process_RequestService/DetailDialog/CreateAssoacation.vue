<template>
  <div>
    <s-scrollbar wrap-style="max-height:500px;">
      <s-tab v-model="activeTab">
        <s-tab-pane label="事件单" name="event">
          事件单
          <Asso-order-list :orderUuid="orderUuid"></Asso-order-list>
        </s-tab-pane>
        <s-tab-pane label="问题单" name="problem">
          问题单
          <Asso-order-list :orderUuid="orderUuid"></Asso-order-list>
        </s-tab-pane>
        <s-tab-pane label="变更单" name="change">
          变更单
          <Asso-order-list :orderUuid="orderUuid"></Asso-order-list>
        </s-tab-pane>
      </s-tab>
    </s-scrollbar>
  </div>
</template>

<script type="text/babel">
  //  import $axios from 'sunflower-ajax';
  import AssoOrderList from './AssociationOrderList.vue'

  export default {
    data() {
      return {
        activeTab: 'event'
      }
    },
    components: {
      AssoOrderList
    },
    props: {
      orderUuid: {
        type: String,
        required: true
      }
    },
    methods: {
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
