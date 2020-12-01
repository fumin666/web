<template>
  <section class="content">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="当天事件走势" name="pane1">
        <event-day v-if="activeTab === 'pane1'" :trendtType="trendtType"></event-day>
      </s-tab-pane>
      <s-tab-pane label="本周事件走势" name="pane2">
        <event-day v-if="activeTab === 'pane2'" :trendtType="trendtType"></event-day>
      </s-tab-pane>
      <s-tab-pane label="本月事件走势" name="pane3">
        <event-day v-if="activeTab === 'pane3'" :trendtType="trendtType"></event-day>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import eventDay from './EventDays'
  export default {
    components: {
      eventDay
    },
    data() {
      return {
        activeTab: 'pane1',
        trendtType: '0'
      }
    },
    watch: {
      activeTab: {
        immediate: true,
        handler(val) {
          if (val === 'pane1') {
            this.trendtType = '0';
          } else if (val === 'pane2') {
            this.trendtType = '1';
          } else {
            this.trendtType = '2';
          }
        }
      }
    },
    methods: {
    },
    created() {
      let {params} = this.$route;
      if (params.type === 'today') {
        this.trendtType = '0';
        this.activeTab = 'pane1';
      } else if (params.type === 'week') {
        this.trendtType = '1';
        this.activeTab = 'pane2';
      } else {
        this.trendtType = '2';
        this.activeTab = 'pane3'
      }
    }
  }
</script>
