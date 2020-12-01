/*
create by YOU
*/
<template>
  <div>
    <s-tab v-model="activeTab">
      <s-tab-pane label="事件单" name="event">
        <event-tab v-if="activeTab === 'event'" @afterChange="passEvent" :uuid="uuid"></event-tab>
      </s-tab-pane>
      <s-tab-pane label="问题单" name="problem">
        <problem-tab v-if="activeTab === 'problem'" @afterChange="passEvent" :uuid="uuid"></problem-tab>
      </s-tab-pane>
      <s-tab-pane label="变更单" name="change">
        <modify-tab v-if="activeTab === 'change'" @afterChange="passEvent" :uuid="uuid"></modify-tab>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import eventTab from './EventTab.vue'
  import problemTab from './ProblemTab.vue'
  import modifyTab from './ModifyTab.vue'
  export default {
    components: {
      eventTab,
      problemTab,
      modifyTab
    },
    props: {
      uuid: ''
    },
    data() {
      return {
        activeTab: 'event',
        eventUrl: '/ItilCommonWorkflow/serachItilIncidentOrder',
        problemUrl: '/ItilCommonWorkflow/serachItilproblemOrder',
        modifyUrl: '/ItilCommonWorkflow/serachItilChangeOrder'
      }
    },
    methods: {
      passEvent() {
        this.$emit('afterChange')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  // 创建工单
  .createProcess
    .s-form-item-content
      & > .s-input, .s-select, .s-textarea, .upload
        width: calc(100% - 49px)
</style>
